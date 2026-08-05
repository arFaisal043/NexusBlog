import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { config } from "../../config";
import { registerInterface } from "./user.interface";
import { CustomError } from "../../utils/customError";
import statusCode from "http-status";

const registerUserService = async (payload: registerInterface) => {
  const { name, password, email, profilePhoto, role } = payload;

  if (!email) {
    console.log("Email is required");
  }

  // _______ user exist or not?
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new CustomError("User is already exist!", statusCode.BAD_REQUEST);
  }

  // _________ Hash password -> env return string
  const hashPass = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds) || 10,
  );

  // create user object
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPass,
      role,
      profile: {
        create: {
          profilePhoto
        }
      }
    },
  });

  // create users profile
  //   await prisma.profile.create({
  //     data: {
  //       userId: createdUser.id,
  //       profilePhoto,
  //     },
  //   });

  // create user to insert into db
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    // for not show pass on response
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const getMyProfileFromDB = async (userID: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { id: userID },
    omit: {
      password: true
    },
    include: {
      profile: true
    }
  })

  return user;
}

const updateMyProfileIntoDB = async (userID: string, payload: any) => {
  const { name, profilePhoto, bio, role } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userID },
    data: {
      name,
      role,
      profile: {
        update: {
          profilePhoto,
          bio
        }
      }
    },
    omit: {
      password: true
    },
    include: {
      profile: true
    }
  })

  return updatedUser;
}

const deleteUserFromDB = async (userId: string) => {
  const result = await prisma.user.delete({
    where: { 
      id: userId 
    }
  });
  
  return result;
}

export const userService = {
  registerUserService,
  getMyProfileFromDB,
  updateMyProfileIntoDB,
  deleteUserFromDB,
};