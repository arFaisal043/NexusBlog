import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { premiumContentService } from "./premium.service";
import { sendSuccess } from "../../utils/response";
import statusCode from "http-status";

const GetPremiumContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await premiumContentService.GetPremiumContent();
        sendSuccess(res, statusCode.OK, "Subscription status retrieves successfully!", result);
    }
)

export const premiumContentController = {
  GetPremiumContent,
};