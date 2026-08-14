import { Router } from "express";
import { postController } from "./post.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/search", postController.searchPosts); // for practicing
router.get("/my-post", authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), postController.getMyPosts);
router.get("/stats", authMiddleware(Role.ADMIN), postController.getPostStats);
router.get("/:postId", postController.getPostsById);
router.patch("/:postId", authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), postController.updatePost);
router.delete("/:postId", authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), postController.deletePost);



export const postRoutes = router;