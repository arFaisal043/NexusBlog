import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create-checkout-session",
  authMiddleware(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.createCheckoutSession,
);

// Cancel Subscription Router
router.post(
  "/cancel",
  authMiddleware(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.cancelSubscription,
);

// webhook endpoint
router.post("/webhook", subscriptionController.handleWebhook);

// get subscription status
router.get(
  "/subscription-status",
  authMiddleware(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.getSubscriptionStatus,
);

export const subscriptionRoutes = router;