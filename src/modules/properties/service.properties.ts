import { title } from "process";
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
    area,
    page,
    limit,
    type,
  } = query;

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

  if (area) {
    andConditions.push({
      area: area,
    });
  }

  if(address) {
    andConditions.push({
      address: {
        contains: address,
        mode: "insensitive",
      }
    });
  }

  if (minprice && maxprice) {
    andConditions.push({
      rentAmount: {
        gte: Number(minprice),
        lte: Number(maxprice),
      },
    });
  }

  if (price) {
    andConditions.push({
      rentAmount: {
       equals: Number(price)
      },
    });
  }



  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },

    take: limit ? Number(limit) : 10,
    skip: page ? (Number(page) - 1) * Number(limit) : 0
  });

  return properties;
};




const getPropertyByIdFromDB = async (id: string) => {
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
