import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpsStatus from "http-status";
import { lanlordService } from "./service.landlord.js";
import type { UserRole } from "../../../generated/prisma/enums.js";

const createProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const property = await lanlordService.createPropertyInDB(userId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "Property created successfully",
      data: property,
    });
  },
);

const updateProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedPayload = req.body;
    const propertyId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    console.log("update property", updatedPayload,
        propertyId, userId, userRole
    )

    const propertyUpdateResult = await lanlordService.updatePropertyInDB(updatedPayload, propertyId as string, userId as string, userRole as UserRole);

    // const propertyUpdateResult = "";
  

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "Property updated successfully",
      data: propertyUpdateResult,
    });
  });

export const landlordController = {
  createProperties,
  updateProperties
};
