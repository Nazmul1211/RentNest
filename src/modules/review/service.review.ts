import { ReviewStatus, RentalStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type { ICreateReviewPayload, IUpdateReviewPayload } from "./interface.review.js";


const createReviewInDB = async (payload: ICreateReviewPayload, tenantId: string) => {
    const { rentalRequestId, rating, comment } = payload;

    const rentalRequest = await prisma.rentalRequest.findFirst({
        where: {
            id: rentalRequestId,
            tenantId,
            status: {
                in: [RentalStatus.PAID],
            },
        },
    });

    if (!rentalRequest) {
        throw new Error("You can only review a property after your rental request has been paid");
    }

    const existingReview = await prisma.review.findFirst({
        where: { rentalRequestId, tenantId },
    });

    if (existingReview) {
        throw new Error("You have already submitted a review for this rental");
    }

    const review = await prisma.review.create({
        data: {
            tenantId,
            rentalRequestId,
            propertyId: rentalRequest.propertyId,
            rating,
            comment,
            status: ReviewStatus.PUBLISHED,
        },
        include: {
            tenant: {
                select:
                {
                    id: true,
                    name: true,
                    email: true
                }
            },
            property: {
                select:
                {
                    id: true,
                    title: true,
                    city: true
                }
            },
        },
    });

    return review;
};


const getReviewsFromDB = async (role?: string) => {
    const reviews = await prisma.review.findMany({
        where: role === "ADMIN" ? {} : { status: ReviewStatus.PUBLISHED },
        include: {
            tenant: {
                select:
                {
                    id: true,
                    name: true,
                    email: true
                }
            },
            property: {
                select:
                {
                    id: true,
                    title: true,
                    city: true
                }
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return reviews;
};


const getSingleReviewFromDB = async (reviewId: string) => {
    const review = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId
        },
        include: {
            tenant: {
                select:
                {
                    id: true,
                    name: true,
                    email: true
                }
            },
            property:
            {
                select:
                {
                    id: true,
                    title: true,
                    city: true,
                    address: true
                }
            },
            rentalRequest: {
                select:
                {
                    id: true,
                    status: true,
                    monthlyRent:
                        true
                }
            },
        },
    });

    return review;
};


const updateReviewInDB = async (reviewId: string, payload: IUpdateReviewPayload, tenantId: string) => {
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId,
            tenantId
        },
    });

    if (!review) {
        throw new Error("Review not found or you don't have permission to update it");
    }

    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId
        },
        data: payload,
        include: {
            tenant: {
                select:
                    { id: true, name: true, email: true }
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true
                }
            },
        },
    });

    return updatedReview;
};


const deleteReviewFromDB = async (reviewId: string, userId: string, role: string) => {
    const whereClause = role === "ADMIN" ? { id: reviewId } : { id: reviewId, tenantId: userId };

    const review = await prisma.review.findFirst({
        where: whereClause
    });

    if (!review) {
        throw new Error("Review not found or you don't have permission to delete it");
    }

    await prisma.review.delete({
        where: {
            id: reviewId
        }
    });

    return {
        message: "Review deleted successfully"
    };
};


export const reviewService = {
    createReviewInDB,
    getReviewsFromDB,
    getSingleReviewFromDB,
    updateReviewInDB,
    deleteReviewFromDB,
};
