import { prisma } from "../../lib/prisma.js";
import type { IRentalRequestPayload } from "./interface.rental.js";

const createRentalRequestInDB = async (
  payload: IRentalRequestPayload,
  userId: string,
) => {
  const { propertyId, moveInDate, moveOutDate, totalMonths, tenantMessage, monthlyRent, totalAmount } = payload;

  const parsedMoveInDate = new Date(moveInDate);
  const parsedMoveOutDate = moveOutDate ? new Date(moveOutDate) : null;

  if (Number.isNaN(parsedMoveInDate.getTime())) {
    throw new Error("Move-in date is required and must be a valid date.");
  }

  if (parsedMoveOutDate && Number.isNaN(parsedMoveOutDate.getTime())) {
    throw new Error("Move-out date must be a valid date.");
  }

  if (parsedMoveOutDate && parsedMoveOutDate <= parsedMoveInDate) {
    throw new Error("Move-out date must be later than move-in date.");
  }

  if (totalMonths !== undefined && (!Number.isInteger(totalMonths) || totalMonths <= 0)) {
    throw new Error("Total months must be a positive integer.");
  }

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId
    },
  });

  const existingPendingRequest = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId: userId,
      status: "PENDING",
    },
  });

  if (existingPendingRequest) {
    throw new Error("You already have a pending rental request for this property.");
  }

  const calculatedMonthlyRent = monthlyRent ?? Number(property.rentAmount);
  const calculatedTotalAmount = totalAmount ?? (calculatedMonthlyRent * (totalMonths ?? 1));

  const createRequest = await prisma.rentalRequest.create({
    data: {
      propertyId,
      tenantId: userId,
      moveInDate: parsedMoveInDate,
      moveOutDate: parsedMoveOutDate,
      totalMonths,
      tenantMessage,
      monthlyRent: calculatedMonthlyRent,
      totalAmount: calculatedTotalAmount,
    },
  });

  return createRequest;
};

const getRentalReqeustsFromDB = async (userId: string) => {
  const getAllRentalRequests = await prisma.rentalRequest.findMany({
    where: {
      tenantId: userId,
    },
  });

  return getAllRentalRequests;
};

const getRentalReqeustByIdFromDB = async (
  requestId: string,
  userId: string,
) => {
  const getRentalRequestById = await prisma.rentalRequest.findUniqueOrThrow({
    where: {
      tenantId: userId,
      id: requestId,
    },
  });

  return getRentalRequestById;
};

export const rentalRequestService = {
  createRentalRequestInDB,
  getRentalReqeustsFromDB,
  getRentalReqeustByIdFromDB,
};
