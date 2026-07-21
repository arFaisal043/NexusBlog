import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUserService(req.body);

        res.status(httpStatus.CREATED).json({
          success: true,
          message: "User Registered Successfully!",
          data: {
            user,
          },
        });
    } catch (error) {
        res.status(httpStatus.CREATED).json({
          success: false,
          message: "User are not Registered Successfully!",
          error: (error as Error).message
        });
    }
};

export const authController = {
  registerUser,
};
