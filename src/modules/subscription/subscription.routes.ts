import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/create-checkout-session", 
    authMiddleware(Role.USER, Role.ADMIN, Role.AUTHOR),
    subscriptionController.createCheckoutSession
);

export const subscriptionRoutes = router;