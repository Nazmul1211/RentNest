import { prisma } from "../../lib/prisma.js";
import type { IPropertyPayload } from "./interface.landlord.js";

const createPropertyInDB = async (
  userId: string,
  jwtPayload: IPropertyPayload,
) => {
  if (!userId) {
    throw new Error("Landlord ID is required");
  }

  const {
    categoryId,
    title,
    description,
    rentAmount,
    securityDeposit,
    address,
    city,
    area,
    country,
    postalCode,
    bedrooms,
    bathrooms,
    sizeSqft,
    images,
    amenities,
    availableFrom,
    slug,
  } = jwtPayload;

  const property = await prisma.property.create({
    data: {
      categoryId,
      title,
      description,
      rentAmount,
      securityDeposit: securityDeposit ?? null,
      address,
      city,
      area: area ?? null,
      country,
      postalCode: postalCode ?? null,
      bedrooms: bedrooms ?? null,
      bathrooms: bathrooms ?? null,
      sizeSqft: sizeSqft ?? null,
      images,
      amenities,
      availableFrom: availableFrom ?? null,
      slug,
      landlordId: userId,
    },
  });

  return property;
};



const updatePropertyInDB = async (
  payload: IPropertyPayload,
  propertyId: string,
  landlordId: string,
  role: string,
) => {
  if (payload && propertyId && landlordId && role) {
    const property = await prisma.property.findUniqueOrThrow({
      where: {
        id: propertyId,
      },
    });

    if (role !== "ADMIN" && landlordId !== property.landlordId) {
      throw new Error(
        "Forbidded: You are not authorized to update the property!",
      );
    }

    const updatedProperty = await prisma.property.update({
      where: {
        id: property.id,
      },
      data: payload,
    });

    return updatedProperty;
  }
};



const deletePropertyFromDB = async (
  propertyId: string,
  landlordId: string,
  role: string,
) => {
  if (propertyId && landlordId) {
    if (role === "ADMIN") {
      await prisma.property.delete({
        where: {
          id: propertyId,
        },
      });
      return null;
    } else {
      const property = await prisma.property.findUniqueOrThrow({
        where: {
          id: propertyId,
        },
      });

      if (landlordId !== property.landlordId) {
        throw new Error(
          "Forbidded: You are not authorized to delete the property!",
        );
      }

      const deletedProperty = await prisma.property.delete({
        where: {
          id: property.id,
        },
      });

      return deletedProperty;
    }
  }
};




const getPropertiesRentalRequestsFromDB = async (landlordId: string) => {

  if(!landlordId) {
    throw new Error("Landlord ID is required!");
  }

  const rentalRequests = await prisma.rentalRequest.findMany({
    where: {
      properties: {
        landlordId: landlordId,
      },
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      properties: {
        select: {
          id: true,
          title: true,
          rentAmount: true,
          city: true,
          area: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentalRequests;
};



const approveOrRejectRentalRequestInDB = async (
  requestId: string,
  landlordId: string,
  payload: { status: string; landlordNote?: string }
) => {
  if (!payload.status || !["APPROVED", "REJECTED"].includes(payload.status)) {
    throw new Error("Status must be either 'APPROVED' or 'REJECTED'.");
  }

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      properties: {
        select: {
          landlordId: true
        }
      }
    }
  });


  if (!rentalRequest) {
    throw new Error("Rental request not found.");
  }

  if (rentalRequest.properties.landlordId !== landlordId) {
    throw new Error("Forbidden: You are not authorized to modify this rental request.");
  }

  if (rentalRequest.status !== "PENDING") {
    throw new Error(`Cannot Proceed this request. Current rental request status is already ${rentalRequest.status}.`);
  }

  const updateData: Record<string, any> = {
    status: payload.status,
    landlordNote: payload.landlordNote ?? null,
  };

  if (payload.status === "APPROVED") {
    updateData.approvedAt = new Date();
  } else {
    updateData.rejectedAt = new Date();
  }

  const updatedRentalRequest = await prisma.rentalRequest.update({
    where: {
      id: requestId
    },
    data: updateData,
  });

  return updatedRentalRequest;
}


export const lanlordService = {
  createPropertyInDB,
  updatePropertyInDB,
  deletePropertyFromDB,
  getPropertiesRentalRequestsFromDB,
  approveOrRejectRentalRequestInDB
};
