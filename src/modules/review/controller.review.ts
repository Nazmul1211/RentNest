import type { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { reviewService } from "./service.review.js";
import httpStatus from "http-status";


const createReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const tenantId = req.user?.id;
        const payload = req.body;

        const result = await reviewService.createReviewInDB(payload, tenantId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Review created successfully!",
            data: result,
        });
    },
);




const getReviews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const role = req.user?.role;

        const result = await reviewService.getReviewsFromDB(role as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Reviews retrieved successfully!",
            data: result,
        });
    },
);


const getSingleReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const reviewId = req.params["id"];

        const result = await reviewService.getSingleReviewFromDB(reviewId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review retrieved successfully!",
            data: result,
        });
    },
);



const updateReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const reviewId = req.params["id"];
        const tenantId = req.user?.id;
        const payload = req.body;

        const result = await reviewService.updateReviewInDB(reviewId as string, payload, tenantId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review updated successfully!",
            data: result,
        });
    },
);


const deleteReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const reviewId = req.params["id"];
        const userId = req.user?.id;
        const role = req.user?.role;

        const result = await reviewService.deleteReviewFromDB(reviewId as string, userId as string, role as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review deleted successfully!",
            data: result,
        });
    },
);


export const reviewController = {
    createReview,
    getReviews,
    getSingleReview,
    updateReview,
    deleteReview,
};
