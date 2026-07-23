import { Request, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import statusCode from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUserService(req.body);
  sendSuccess(res, statusCode.OK, "User Login Successfully!", result);
});

export const authController = {
  loginUser,
};