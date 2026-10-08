import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionServices } from "./subscription.service";
import { sendSuccess } from "../../utils/response";
import statuscode from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionServices.createCheckoutSession(
      userId as string,
    );
    sendSuccess(
      res,
      statuscode.OK,
      "Checkout session completed successfully!",
      result,
    );
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, nex: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    // We never can't get any response from here so don't need to send result
    await subscriptionServices.handleWebhook(event, signature as string);
    sendSuccess(res, statuscode.OK, "Webhook triggered successfully!");
  },
);

const getSubscriptionStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionServices.getSubscriptionStatus(
      userId as string,
    );
    sendSuccess(
      res,
      statuscode.OK,
      "Subscription status retrieves successfully!",
      result,
    );
  },
);

const cancelSubscription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionServices.cancelSubscription(
      userId as string,
    );
    sendSuccess(
      res,
      statuscode.OK,
      "Subscription canceled successfully!",
      result,
    );
  },
);

export const subscriptionController = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription,
};
