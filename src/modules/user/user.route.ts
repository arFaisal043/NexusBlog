import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { CustomError } from "../../utils/customError";
import statusCode from "http-status";
import { verifyToken } from "../../utils/jwt";
import { config } from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { decode } from "node:punycode";
import { prisma } from "../../lib/prisma";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", userController.registerUser);

router.get("/me", authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), userController.getMyProfile);

router.put("/my-profile", 
    authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), 
    userController.updateMyProfile
);


export const userRoutes = router;
