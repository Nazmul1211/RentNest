import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./service.auth.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpsStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  if (!payload) {
    throw new Error("Payload is required"); 
  }

  const { name, email, password, phone, role } = payload;

  console.log(
    name,
    email,
    password,
    phone,
    role,
    "payload from service.user.ts",
  );

  const user = await authService.registerUserIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "User registered successfully",
    data: {
      user,
    },
  });
});


const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  if (!payload) {
    throw new Error("Payload is required"); 
  }

  const { email, password } = payload;

 const result = await authService.loginUserFromDB(email, password);

 sendResponse(res, {
  success: true,
  statusCode: httpsStatus.OK,
  message: "User logged in successfully",
  data: {
    result,
  },
 })
})


export const authController = {
  registerUser,
  loginUser,
};
