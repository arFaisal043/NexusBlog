import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { CustomError } from "../../utils/customError";
import { ILoginUser } from "./auth.interface";
import statusCode from "http-status";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config";
import { createToken } from "../../utils/jwt";

/*  _______ Verify User
    check 1: User give email and password or not?
    check 2: If user are registered or not?  -> fetch from DB
    check 3: Compare password
*/

const loginUserService = async (credentials: ILoginUser) => {
  const { email, password } = credentials;

  // ________ check 1: User give email and password or not?
  if (!email || !password) {
    throw new CustomError(
      "Email and password are required",
      statusCode.BAD_REQUEST,
    );
  }

  // _______ check 2: If user are registered or not?
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new CustomError(
      "Email and password are required",
      statusCode.UNAUTHORIZED,
    );
  }

  // If account is blocked or inactive
  if (user.activeStatus === "INACTIVE") {
    throw new Error(
      "Your account has been blocked. Please contact with our support team.",
    );
  }

  // _______ check 3: Compare password by bcrypt-compare
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new CustomError("Incorrect Password", statusCode.UNAUTHORIZED);
  }

  // ________ create access and refresh token

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };


  // const accessToken = jwt.sign(payload, config.secret as string, {
  //   expiresIn: config.expiresIn as any,
  // });

  const accessToken = createToken(
    payload,
    config.secret as string,
    config.expiresIn as SignOptions,
  );

  // const refreshToken = jwt.sign(payload, config.refreshSecret as string, {
  //   expiresIn: config.refreshExpiresIn as any,
  // });

  const refreshToken = createToken(
    payload,
    config.refreshSecret as string,
    config.refreshExpiresIn as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    },
  };
};

export const authService = {
  loginUserService,
};
