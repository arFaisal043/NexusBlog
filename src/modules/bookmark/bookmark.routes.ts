import { Router } from "express";
import { bookmarkController } from "./bookmark.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// /api/bookmarks/posts/:postId
router.post(
  "/posts/:postId",
  authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR),
  bookmarkController.toggleBookmark
);

// /api/bookmarks
router.get(
  "/",
  authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR),
  bookmarkController.getMyBookmarks
);

export const bookmarkRoutes = router;
