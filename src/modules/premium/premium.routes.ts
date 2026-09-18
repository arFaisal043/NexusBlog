import { Router } from "express";
import { premiumContentController } from "./premium.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.ADMIN, Role.AUTHOR, Role.USER),
  premiumContentController.GetPremiumContent,
);

export const premiumContentRoutes = router;