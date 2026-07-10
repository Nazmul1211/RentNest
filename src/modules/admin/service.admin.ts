import { prisma } from "../../lib/prisma.js";
import type { IUpdateUserStatusPayload } from "./interface.admin.js";


    const getAllUserFromDB = async (userId: string, userRole: string) => {
        if (userRole !== "ADMIN") {
            throw new Error("Unauthorized access");
        }

        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: userId,
                },
            },
            omit: {
                password: true,
            }

        });

        return users;
    }


    const updateUserStatusInDB = async(payload: IUpdateUserStatusPayload, userId: string, adminId: string, userRole: string) => {
        if (userRole !== "ADMIN") {
            throw new Error("Unauthorized access");
        } 

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error("User not found!");
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                status: payload.status,
            },
            omit: {
                password: true,
            }
        });

        return updatedUser;
    }


    const getAllPropertiesFromDB = async(userId: string, userRole: string) => {
        if (userRole !== "ADMIN") {
            throw new Error("Unauthorized access");
        }

        const properties = await prisma.property.findMany({
            where: {
                landlordId: {
                    not: userId,
                },
            },
        });

        return properties;
    }


    const getAllRentalRequestsFromDB = async(userId: string, userRole: string) => {
        if (userRole !== "ADMIN") {
            throw new Error("Unauthorized access");
        }

        const rentalRequests = await prisma.rentalRequest.findMany();

        return rentalRequests;
    }





export const adminService = {
    getAllUserFromDB,
    updateUserStatusInDB,
    getAllPropertiesFromDB,
    getAllRentalRequestsFromDB,
}