import { prisma } from "../../lib/prisma.js";
import type { IRentalRequestPayload } from "./interface.rental.js";

const createRentalRequestInDB = async (
  payload: IRentalRequestPayload,
  userId: string,
) => {

  const { propertyId, moveInDate, moveOutDate, totalMonths, tenantMessage, monthlyRent, totalAmount } = payload;

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId
    },
  });

  const calculatedMonthlyRent = monthlyRent ?? Number(property.rentAmount);
  const calculatedTotalAmount = totalAmount ?? (calculatedMonthlyRent * (totalMonths ?? 1));

  const createRequest = await prisma.rentalRequest.create({
    data: {
      propertyId,
      tenantId: userId,
      moveInDate,
      moveOutDate,
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
