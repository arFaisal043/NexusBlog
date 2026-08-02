import { NextFunction, Request, Response } from "express";
import statusCode from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { verifyToken } from "../../utils/jwt";
import { CustomError } from "../../utils/customError";

const registerUser = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
    const user = await userService.registerUserService(req.body);
    sendSuccess(res, statusCode.CREATED, "User registered successfully!", user);
})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const profile = await userService.getMyProfileFromDB(req.user?.id as string);
  sendSuccess(res, statusCode.OK, "User profile fetched successfully!", profile);
})

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?.id;
  const payload = req.body;
  const updatedProfile = await userService.updateMyProfileIntoDB(id as string, payload);
  sendSuccess(res, statusCode.OK, "User profile updated successfully!", updatedProfile);
})

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};