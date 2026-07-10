import { prisma } from "../../lib/prisma.js";
import type { IRentalRequestPayload } from "./interface.rental.js";

const createRentalRequestInDB = async (
  payload: IRentalRequestPayload,
  userId: string,
) => {
  const createRequest = await prisma.rentalRequest.create({
    data: {
      ...payload,
      tenantId: userId,
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
