import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const user = await authService.registerUserService(req.body);
    sendSuccess(res, httpStatus.CREATED, "User registered successfully!", user);
})


export const authController = {
  registerUser,
};
