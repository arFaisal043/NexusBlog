import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validateRequest";
import { registerSchema, updateProfileSchema } from "./user.validation";

const router = Router();

router.post("/register", validateRequest(registerSchema), userController.registerUser);

router.get("/me", authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR), userController.getMyProfile);

router.put("/my-profile", 
    authMiddleware(Role.ADMIN, Role.USER, Role.AUTHOR),
    validateRequest(updateProfileSchema),
    userController.updateMyProfile
);

router.delete("/:id", authMiddleware(Role.ADMIN), userController.deleteUser);


export const userRoutes = router;
