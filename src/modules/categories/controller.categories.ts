import catchAsync from "../../utils/catchAsync.js";
import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse.js";
import httpsStatus from "http-status";
import { categoryService } from "./service.categories.js";


const createCategory = catchAsync(
    async (req: Request, res: Response) => {
  const payload = req.body;
    if (!payload) {
        throw new Error("Category data is required");
    }


    const category = await categoryService.createCategoryInDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "Category created successfully",
      data: category,
    })
})


const getAllCategories = catchAsync(
    async (req: Request, res: Response) => {
        const categories = await categoryService.getAllCategoriesFromDB();

        sendResponse(res, {
            success: true,
            statusCode: httpsStatus.OK,
            message: "Categories retrieved successfully",
            data: categories,
        })
    }
)


export const categoryController = {
    createCategory,
    getAllCategories,

}

