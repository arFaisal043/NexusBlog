import { Router } from "express";
import { reactionController } from "./reaction.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// /api/reactions/posts/:postId
router.post(
  "/posts/:postId",
  authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR),
  reactionController.toggleReaction
);

export const reactionRoutes = router;
