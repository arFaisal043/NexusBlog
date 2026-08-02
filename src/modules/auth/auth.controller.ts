import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import statusCode from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  const payload = req.body;
  const {accessToken, refreshToken} = await authService.loginUserService(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60, // 1 hr
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  sendSuccess(res, statusCode.OK, "User Login Successfully!", {
    accessToken,
    refreshToken,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {accessToken} = await authService.refreshTokenService(req.cookies.refreshToken);
  
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60, // 1 hr
  });

  sendSuccess(res, statusCode.OK, "Token refreshed successfully", accessToken);
})

export const authController = {
  loginUser,
  refreshToken,
};