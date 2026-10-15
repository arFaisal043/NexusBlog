import { z } from "zod";

export const createPostSchema = z.object({
  title:     z.string().min(3, "Title must be at least 3 characters"),
  content:   z.string().min(10, "Content must be at least 10 characters"),
  tags:      z.array(z.string()).min(1, "At least one tag is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
  isPremium: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  status:    z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const updatePostSchema = z.object({
  title:     z.string().min(3).optional(),
  content:   z.string().min(10).optional(),
  tags:      z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
  isPremium: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  status:    z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});
