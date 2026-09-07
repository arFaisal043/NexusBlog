import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { subscriptionServices } from "./subscription.service";
import { sendSuccess } from "../../utils/response";
import statuscode from "http-status";

const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next:NextFunction) => {
        const userId = req.user?.id;
        const result = await subscriptionServices.createCheckoutSession(userId as string);
        sendSuccess(res, statuscode.OK, "Checkout session completed successfully!", result);
    }
)

export const subscriptionController = {
  createCheckoutSession,
};