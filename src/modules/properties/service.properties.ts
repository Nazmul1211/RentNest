import { randomUUID } from "node:crypto";
import type { PropertyWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";
import type { IPropertyQuery } from "./interface.properties.js";

const getPropertiesFromDB = async (query: IPropertyQuery) => {
  const {
    searchTerm,
    city,
    price,
    minprice,
    maxprice,
    location,
    address,
    page,
    limit,
    type,
  } = query;

  const pageNumer = page !== undefined ? Number(page) : 1;
  const limitNumber = limit !== undefined ? Number(limit) : 10;

  if (!Number.isInteger(pageNumer) || pageNumer <= 0) {
    throw new Error("Page should be a positive integer.");
  }

  if (!Number.isInteger(limitNumber) || limitNumber <= 0) {
    throw new Error("Limit should be a positive integer.");
  }

  const priceInNumber = price !== undefined ? Number(price) : undefined;
  const minPriceInNumber = minprice !== undefined ? Number(minprice) : undefined;
  const maxpriceInNumber = maxprice !== undefined ? Number(maxprice) : undefined;

  if (priceInNumber !== undefined && (Number.isNaN(priceInNumber) || priceInNumber <= 0)) {
    throw new Error("Price must be a positive number.");
  }

  if (minPriceInNumber !== undefined && (Number.isNaN(minPriceInNumber) || minPriceInNumber <= 0)) {
    throw new Error("Minprice must be a positive number.");
  }

  if (maxpriceInNumber !== undefined && (Number.isNaN(maxpriceInNumber) || maxpriceInNumber <= 0)) {
    throw new Error("Maxprice must be a positive number.");
  }

  if (minPriceInNumber !== undefined && maxpriceInNumber !== undefined && minPriceInNumber > maxpriceInNumber) {
    throw new Error("Minprice should not be larger than maxprice.");
  }

  const andConditions: PropertyWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (city) {
    andConditions.push({
      city: city,
    });
  }

  if (location) {
    andConditions.push({
      area: location,
    });
  }

  if (address) {
    andConditions.push({
      address: {
        contains: address,
        mode: "insensitive",
      },
    });
  }

  if (minPriceInNumber !== undefined && maxpriceInNumber !== undefined) {
    andConditions.push({
      rentAmount: {
        gte: minPriceInNumber,
        lte: maxpriceInNumber,
      },
    });
  }

  if (priceInNumber !== undefined) {
    andConditions.push({
      rentAmount: {
        equals: priceInNumber,
      },
    });
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },

    take: limitNumber,
    skip: (pageNumer - 1) * limitNumber,
  });

  return properties;
};

const getPropertyByIdFromDB = async (id: string) => {

  if(!id){
    throw new Error("Property not found!");
  }

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  return property;
};

export const propertyService = {
  getPropertiesFromDB,
  getPropertyByIdFromDB,
};
