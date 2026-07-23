import { Request, Response } from "express";
import statusCode from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.registerUserService(req.body);
    sendSuccess(res, statusCode.CREATED, "User registered successfully!", user);
})


export const userController = {
  registerUser,
};
