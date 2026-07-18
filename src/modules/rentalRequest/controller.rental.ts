import type { Request, Response,  NextFunction } from "express"
import catchAsync from "../../utils/catchAsync.js"
import { sendResponse } from "../../utils/sendResponse.js"
import { rentalRequestService } from "./service.rental.js"



const createRentalRequest = catchAsync(
    async(req: Request, res: Response, next: NextFunction) => {
        console.log("Rental Request Creation Api hitted.")

        const payload = req.body;
        const userId = req.user?.id;
        console.log(userId);

        const rentalRequest = await rentalRequestService.createRentalRequestInDB(payload, userId as string);

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Rental Request Created Successfully!",
            data: rentalRequest  
        })
    }
)


const getRentalRequests = catchAsync(
    async(req: Request, res: Response, next: NextFunction) => {

        const userId = req.user?.id;

        const getUserRentalRequests = await rentalRequestService.getRentalReqeustsFromDB(userId as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Rental Requests retrieved successfully!",
            data: getUserRentalRequests
        });

    }
)


const getRentalRequestById = catchAsync(
    async(req: Request, res: Response, next: NextFunction) => {

        const requestId = req.params?.id;
        const userId = req.user?.id;

        const getRentalRequestById = await rentalRequestService.getRentalReqeustByIdFromDB(requestId as string, userId as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Rental Request retrieved successfully by request id!",
            data: getRentalRequestById
        });
    }
)




export const rentalController = {
    createRentalRequest,
    getRentalRequests,
    getRentalRequestById,
}