import { z } from "zod";

export const registerSchema = z.object({
  name:         z.string().min(2, "Name must be at least 2 characters"),
  email:        z.string().email("Invalid email format"),
  password:     z.string().min(6, "Password must be at least 6 characters"),
  profilePhoto: z.string().url("Profile photo must be a valid URL").optional(),
  role:         z.enum(["USER", "AUTHOR", "ADMIN"]).optional(),
});

export const updateProfileSchema = z.object({
  name:         z.string().min(2).optional(),
  profilePhoto: z.string().url().optional(),
  bio:          z.string().max(300, "Bio cannot exceed 300 characters").optional(),
});
