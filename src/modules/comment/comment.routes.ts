import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { commentController } from "./comment.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.createComment);
router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.get("/:commentId", commentController.getCommentByCommentId);
router.patch("/:commentId", authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.updateComment);
router.delete("/:commentId",authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), commentController.deleteComment);
router.patch("/:commentId/moderate", authMiddleware(Role.ADMIN), commentController.moderateComment);

export const commentsRoutes = router;