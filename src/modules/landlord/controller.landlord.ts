import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpsStatus from "http-status";
import { lanlordService } from "./service.landlord.js";


const createProperties = async (req : Request, res : Response) => {
    const userId = req.user?.id;
    
    const property = await lanlordService.createPropertyInDB(userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpsStatus.CREATED,
        message: "Property created successfully",
        data: property,
    });
};            


export const landlordController = {
    createProperties,

}