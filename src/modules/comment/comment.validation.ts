import { z } from "zod";

export const createCommentSchema = z.object({
  postId:  z.string().uuid("Invalid post ID"),
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
});
