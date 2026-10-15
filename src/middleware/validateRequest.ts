import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "../utils/customError";
import statusCode from "http-status";

export const validateRequest = (schema: ZodSchema) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessage = JSON.stringify(result.error.flatten().fieldErrors);
      throw new CustomError(errorMessage, statusCode.BAD_REQUEST);
    }

    req.body = result.data;
    next();
  });
};
