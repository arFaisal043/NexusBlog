import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { CustomError } from "../utils/customError";
import statusCode from "http-status";
import { verifyToken } from "../utils/jwt";
import { config } from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { NextFunction, Request, Response } from "express";

// auth(Role.ADMIN, Role.USER, Role.AUTHOR)
// auth() ==> ...userRoleList ==> [Role.ADMIN, Role.USER, Role.AUTHOR]

export const authMiddleware = (...userRoleList: Role[]) => {

  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken ? 
        req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer") ? 
        req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    // __________ has token or not?
    if (!token) {
      throw new CustomError(
        "User has not access token",
        statusCode.UNAUTHORIZED,
      );
    }

    // _________ verify access token
    // const decoded = jwt.verify(accessToken, config.secret as string);
    const decoded = verifyToken(token, config.secret as string);
    if (!decoded.success) {
      throw new Error("Something is wrong!");
    }

    // _________ Role check
    const { name, email, id, role } = decoded.data as JwtPayload;

    if (userRoleList.length && !userRoleList.includes(role)) {
      throw new CustomError(
        "You don't have permission to access this resources",
        statusCode.FORBIDDEN,
      );
    }

    // _________ user exist or not? and activity check
    const user = await prisma.user.findUnique({
      where: { id, email, name, role },
    });

    if (!user) {
      throw new CustomError("User not found!", statusCode.NOT_FOUND);
    }

    if (user.activeStatus === "INACTIVE") {
      throw new Error(
        "Your account has been blocked. Please contact with our support team.",
      );
    }

    req.user = {
        email,
        name,
        id,
        role
    }

    next();
  });
}