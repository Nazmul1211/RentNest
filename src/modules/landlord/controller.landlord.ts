import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpsStatus from "http-status";
import { lanlordService } from "./service.landlord.js";
import type { UserRole } from "../../../generated/prisma/enums.js";

const createProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const property = await lanlordService.createPropertyInDB(userId as string, req.body);

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

    const propertyUpdateResult = await lanlordService.updatePropertyInDB(updatedPayload, propertyId as string, userId as string, userRole as UserRole);
  

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "Property updated successfully",
      data: propertyUpdateResult,
    });
  });


  const deleteProperties = catchAsync(
    async(req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    await lanlordService.deletePropertyFromDB(propertyId as string, userId as string, userRole as UserRole);

    sendResponse(res, {
        success: true,
        statusCode: httpsStatus.OK,
        message: "Property Deleted Successfully!",
        data: null
    })

    }
  )


  const getAllRentalRequestsForProperties = catchAsync(
    async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;

        // console.log("landLord All Rental Request Get methods hits");

        const propertiesWithRentalRequests = await lanlordService.getPropertiesRentalRequestsFromDB(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpsStatus.OK,
        message: "Retrieved all rental requests for landlord's properties successfully!",
        data: propertiesWithRentalRequests
    })

    return null;

    }

  )


  const approveOrRejectRentalRequest = catchAsync(
    async(req: Request, res: Response, next: NextFunction) => {

        const requestId = req.params?.id;
        const landlordId = req.user?.id;
        const payload = req.body;
        
        // console.log("landLord Approve or Reject Rental Request Api hit");

        const landlordConcent = await lanlordService.approveOrRejectRentalRequestInDB(requestId as string, landlordId as string, payload);

        sendResponse(res, {
            success: true,
            statusCode: httpsStatus.OK,
            message: "Rental Request Approved or Rejected Successfully!",
            data: landlordConcent
        })
    }
  )

export const landlordController = {
  createProperties,
  updateProperties,
  deleteProperties,
  getAllRentalRequestsForProperties,
  approveOrRejectRentalRequest,
};
