import { NextFunction, Request, Response, Router } from "express";
import { premiumContentController } from "./premium.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";
import { subscriptionGuard } from "../../middleware/premiumGuard";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.ADMIN, Role.AUTHOR, Role.USER),
  subscriptionGuard(),
  premiumContentController.GetPremiumContent,
);

export const premiumContentRoutes = router;