import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./service.auth.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpsStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;

  if (!payload) {
    throw new Error("Payload is required"); 
  }

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


const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;

  if (!payload) {
    throw new Error("Payload is required"); 
  }

  const { email, password } = payload;

 const result = await authService.loginUserFromDB(email, password);

  res.cookie("AccessToken" , result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, //  1 days
  })

   res.cookie("RefreshToken" , result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 30, //  30 days
  })


 sendResponse(res, {
  success: true,
  statusCode: httpsStatus.OK,
  message: "User logged in successfully",
  data: result,
 })
})


const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.RefreshToken;
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const accessToken = await authService.refreshToken(refreshToken);


  res.cookie("AccessToken" , accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, //  1 days
  })

  sendResponse(res, {
    success: true,
    statusCode: httpsStatus.OK,
    message: "Access token generated successfully",
    data: { 
      accessToken 
    },
  });
});


const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if(!user) {
    throw new Error("User not found");
  }

  const userProfile = await authService.getUserProfileFromDB(user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpsStatus.OK,
    message: "User profile fetched successfully",
    data: userProfile,
  })

});




export const authController = {
  registerUser,
  loginUser,
  refreshToken,
  getMyProfile,
};
