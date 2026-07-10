import { prisma } from "../../lib/prisma.js";
import type { IPropertyPayload } from "./interface.landlord.js";

const createPropertyInDB = async (userId: string , jwtPayload: IPropertyPayload) => {
    
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


const updatePropertyInDB = async (
    payload: IPropertyPayload, 
    propertyId: string,
    landlordId: string,
    role: string
) => {
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
    } = payload;

    if(payload && propertyId && landlordId && role){

        const property = await prisma.property.findUniqueOrThrow({
            where : {
                id: propertyId,
                landlordId: landlordId
            }
        })

        if(landlordId !== property.landlordId){
            throw new Error("Forbidded: You are not authorized to update the property!");
        }

        const updatedProperty = await prisma.property.update({
            where: {
                id: property.id
            },
            data: payload
        })

        return updatedProperty;
    }
}

export const lanlordService = {
    createPropertyInDB,
    updatePropertyInDB,
};
