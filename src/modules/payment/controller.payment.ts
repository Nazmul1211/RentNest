import type { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { paymentService } from "./service.payment.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpsStatus from "http-status";

const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const { rentalRequestId } = req.body;

        const result = await paymentService.createCheckoutSessionInDB(userId as string, rentalRequestId);

        sendResponse(res, {
            success: true,
            statusCode: httpsStatus.CREATED,
            message: "Stripe checkout session created successfully!",
            data: result
        })
    }
)



const confirmPayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const signature = req.headers["stripe-signature"];

        const result = await paymentService.handlePaymentConfirmation(
            req.body as Buffer,
            signature as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpsStatus.OK,
            message: "Payment confirmed successfully!",
            data: result,
        });

    })


const getPayments = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const role = req.user?.role;

        const result = await paymentService.getPaymentsFromDB(userId as string, role as string);

        sendResponse(res, {
            success: true,
            statusCode: httpsStatus.OK,
            message: "Payments retrieved successfully!",
            data: result,
        });
    }
)


const getSinglePayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const paymentId = req.params.id;
        const userId = req.user?.id ;
        const role = req.user?.role;

        const result = await paymentService.getSinglePaymentFromDB(paymentId as string, userId as string, role as string);

        sendResponse(res, {
            success: true,
            statusCode: httpsStatus.OK,
            message: "Payment retrieved successfully!",
            data: result,
        });
    }
)


export const paymentController = {
    createCheckoutSession,
    getPayments,
    getSinglePayment,
    confirmPayment
}
