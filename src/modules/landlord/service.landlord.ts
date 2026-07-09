import { prisma } from "../../lib/prisma.js";
import type { IPropertyPayload } from "./interface.landlord.js";

const createPropertyInDB = async (userId: string | undefined, jwtPayload: IPropertyPayload) => {
    
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
        slug
    } = jwtPayload;

    const property = await prisma.property.create({
        data: {
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
            landlordId: userId,
        }
    });

    return property;
};

export const lanlordService = {
    createPropertyInDB,
};
