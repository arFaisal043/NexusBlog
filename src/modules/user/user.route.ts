import { Request, Response, Router } from "express";
import { authController } from "./user.controller";

const router  = Router();

router.post("/register", authController.registerUser);


export const authRoutes = router;