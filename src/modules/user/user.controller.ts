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
  // const { accessToken } = req.cookies; // we can also get token from -> req.headers.authorization

  // // __________ 1: has token?
  // if (!accessToken) {
  //   throw new CustomError("User has not access token", statusCode.UNAUTHORIZED);
  // }

  // // _________ 2: verify access token
  // // const decoded = jwt.verify(accessToken, config.secret as string);

  // const decoded = verifyToken(accessToken, config.secret as string);
  // // console.log(decoded); -> user info

  // if (typeof decoded === "string") {
  //   throw new Error("Decoded is a string");
  // }

  // const profile = await userService.getMyProfileService(decoded.id);

  const profile = await userService.getMyProfileService(req.user?.id);

  sendSuccess(res, statusCode.OK, "User profile fetched successfully!", profile);
})


export const userController = {
  registerUser,
  getMyProfile,
};
