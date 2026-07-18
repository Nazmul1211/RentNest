import Stripe from "stripe";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums.js";
import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";

const stripe = new Stripe((config.stripe_secret_key as string).trim());


const createCheckoutSessionInDB = async (
  userId: string,
  rentalRequestId: string,
) => {
  if (!rentalRequestId) {
    throw new Error("Rental request id is required");
  }

  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalRequestId,
      tenantId: userId,
      status: RentalStatus.APPROVED,
    },
    include: {
      tenant: true,
      properties: true,
      payments: true,
    },
  });

  // console.log("Rental Request Data :", rentalRequest);

  if (!rentalRequest) {
    throw new Error("Approved rental request not found");
  }

  const completedPayment = rentalRequest.payments.find(
    (payment) => payment.status === PaymentStatus.COMPLETED,
  );

  if (completedPayment) {
    throw new Error("This rental request is already paid");
  }

  // check stripe customer id exists or not
  let stripeCustomerId = rentalRequest.tenant.stripeCustomerId;

  // if customer id not found , create a customer id
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: rentalRequest.tenant.email,
      name: rentalRequest.tenant.name,
      metadata: {
        userId,
      },
    });

    stripeCustomerId = customer.id;
  }


  const amount = Number(rentalRequest.monthlyRent);

  const payment = await prisma.payment.create({
    data: {
      rentalRequestId: rentalRequest.id,
      payerId: userId,
      amount,
      currency: "bdt",
      status: PaymentStatus.PENDING,
      stripeCustomerId,
    },
  });



  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: rentalRequest.properties.title,
            description: `Rent payment for ${rentalRequest.properties.city}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      paymentId: payment.id,
      rentalRequestId: rentalRequest.id,
      tenantId: userId,
      propertyId: rentalRequest.propertyId,
    },
    success_url: `${config.appUrl}/payment/success`,
    cancel_url: `${config.appUrl}/payment/cancel`,
  });



  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      stripeCheckoutSessionId: session.id,
    },
  });



  return {
    paymentId: payment.id,
    checkoutUrl: session.url,
    stripeCheckoutSessionId: session.id,
    amount,
    currency: "bdt",
    status: PaymentStatus.PENDING,
  };
};





const handlePaymentConfirmation = async (
  payload: Buffer,
  signature: string,
) => {
  if (!signature) {
    throw new Error("Stripe signature is missing");
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    (config.stripe_webhook_secret as string).trim(),
  );



  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentId = session.metadata?.paymentId;
    const rentalRequestId = session.metadata?.rentalRequestId;
    const tenantId = session.metadata?.tenantId;

    if (!paymentId || !rentalRequestId || !tenantId) {
      throw new Error("Stripe metadata is missing");
    }

    const stripePaymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const stripeCustomerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    if (!stripePaymentIntentId || !stripeCustomerId) {
      throw new Error("Stripe payment intent or customer id is missing");
    }

    await prisma.$transaction([

      // Update Payment Model
      prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: PaymentStatus.COMPLETED,
          transactionId: stripePaymentIntentId,
          stripePaymentIntentId,
          stripeCustomerId,
          paidAt: new Date(),
        },
      }),

      // Update rentalRequest Model
      prisma.rentalRequest.update({
        where: {
          id: rentalRequestId,
        },
        data: {
          status: RentalStatus.PAID,
          paidAt: new Date(),
        },
      }),

      // Update User Model
      prisma.user.update({
        where: {
          id: tenantId,
        },
        data: {
          stripeCustomerId,
          hasCompletedPayment: true,
        },
      }),
    ]);
  }



  return {
    received: true,
  };
};




const getPaymentsFromDB = async (userId: string, role: string) => {

  const whereClause =
    role === "ADMIN" ? {} : { payerId: userId };

  const payments = await prisma.payment.findMany({
    where: whereClause,
    include: {
      payer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payment: {
        select: {
          id: true,
          status: true,
          monthlyRent: true,
          properties: {
            select: {
              id: true,
              title: true,
              city: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};



const getSinglePaymentFromDB = async (paymentId: string, userId: string, role: string) => {
  const whereClause =
    role === "ADMIN"
      ? { id: paymentId }
      : { id: paymentId, payerId: userId };

  const payment = await prisma.payment.findUniqueOrThrow({
    where: whereClause,
    include: {
      payer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payment: {
        select: {
          id: true,
          status: true,
          monthlyRent: true,
          properties: {
            select: {
              id: true,
              title: true,
              city: true,
              address: true,
            },
          },
        },
      },
    },
  });

  return payment;
};

export const paymentService = {
  createCheckoutSessionInDB,
  handlePaymentConfirmation,
  getPaymentsFromDB,
  getSinglePaymentFromDB,
};
