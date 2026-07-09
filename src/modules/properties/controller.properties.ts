import catchAsync from "../../utils/catchAsync.js";
import type { NextFunction, Request, Response } from "express";
import { propertyService } from "./service.properties.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpsStatus from "http-status";
import type { IPropertyQuery } from "./interface.properties.js";

const getProperties = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const filters = req.query as IPropertyQuery;

        console.log(filters, "filters in controller");

        const properties = await propertyService.getPropertiesFromDB(filters);

        sendResponse(res, {
            success: true,
            statusCode: httpsStatus.OK,
            message: "Property retrieved successfully!",
            data: properties,
        })
    }
)


const getPropertyById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const propertyId = req.params?.id;

        const property = await propertyService.getPropertyByIdFromDB(propertyId as string);

        
        sendResponse(res, {
            success: true,
            statusCode: httpsStatus.OK,
            message: "property retrieved successfully by property id!",
            data: property,
        })
    }
)


export const propertyController = {
    getProperties,
    getPropertyById,
}