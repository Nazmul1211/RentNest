import type { Request, Response, NextFunction } from "express"
import catchAsync from "../../utils/catchAsync.js"
import { sendResponse } from "../../utils/sendResponse.js";
import { adminService } from "./service.admin.js";




const getAllUser = catchAsync(
    async(req: Request, res: Response, next: NextFunction) => {

        const userRole = req.user?.role;
        const userId = req.user?.id

        const result = await adminService.getAllUserFromDB(userId as string, userRole as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "All users fetched successfully",
            data: result,
        })
    }
) 

const updateUserStatus = catchAsync (
    async(req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;
        const adminId = req.user?.id
        const userId = req.params.id
        const payload = req.body;

        const result = await adminService.updateUserStatusInDB(payload, userId as string, adminId as string, userRole as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "User status updated successfully",
            data: result,
        })
    }
)


const getAllProperties = catchAsync (
    async(req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;
        const userId = req.user?.id

        const result = await adminService.getAllPropertiesFromDB(userId as string, userRole as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "All properties fetched successfully",
            data: result,
        })
    }
)


const getAllRentalRequests = catchAsync (
    async(req: Request, res: Response, next: NextFunction) => {

        const userRole = req.user?.role;
        const userId = req.user?.id

        const result = await adminService.getAllRentalRequestsFromDB(userId as string, userRole as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "All rental requests fetched successfully",
            data: result,
        })
    }
)





export const adminController = {
    getAllUser,
    updateUserStatus,
    getAllProperties,
    getAllRentalRequests,
}