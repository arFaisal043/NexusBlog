import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { CustomError } from "../../utils/customError";
import { ILoginUser } from "./auth.interface";
import statusCode from "http-status";

/* _______ Verify User
    check 1: User give email and password or not?
    check 2: If user are registered or not?  -> fetch from DB
    check 3: Compare password */

const loginUserService = async (credentials: ILoginUser) => {
  const { email, password } = credentials;

  // check 1: User give email and password or not?
  if (!email || !password) {
    throw new CustomError(
      "Email and password are required",
      statusCode.BAD_REQUEST,
    );
  }

  // check 2: If user are registered or not?
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new CustomError(
      "Email and password are required",
      statusCode.UNAUTHORIZED,
    );
  }

  // check 3: Compare password by bcrypt compare
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if(!isPasswordMatch) {
    throw new CustomError("Incorrect Password", statusCode.UNAUTHORIZED)
  }

  return user;
};

export const authService = {
  loginUserService,
};
