import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { loginSchema } from "./auth.validation";

const router = Router();

router.post("/login", validateRequest(loginSchema), authController.loginUser);
router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;