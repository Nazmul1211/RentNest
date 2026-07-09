import type { UserRole } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type { IUserPayload } from "./interface.auth.js";
import bcrypt from "bcrypt";
import config from "../../config/index.js";
import { jwtUtils } from "../../utils/jwt.js";
import type { JwtPayload } from "jsonwebtoken";

const normalizeEmail = (email: string) => email.trim().toLowerCase();


const registerUserIntoDB = async (payload: IUserPayload) => {
  const {name, email, password, phone, role} = payload;
  const normalizedEmail = normalizeEmail(email);

  // console.log(name, email, password, phone, role, "payload from registerUserIntoDB");

  if(role === "ADMIN") {
    throw new Error("You are not allowed to register as an admin");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  })
  
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  const createUser = await prisma.user.create({
      data: {
        name, 
        email: normalizedEmail,
        password: hashPassword,
        phone: phone ?? null,
        role: role as UserRole
      }
  });


  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: createUser.id,
      email: createUser.email || email,
    },
    omit : {
      password: true,
    }
  })

  return user;

}

const loginUserFromDB = async (email: string, password: string) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    },
  })

  if (!user) {
    throw new Error("User not found");
  } else if(user.status === "SUSPENDED") {
    throw new Error("User is suspended");
  } else if(user.status === "BANNED") {
    throw new Error("User is banned");
  } else if(user.status === "DELETED") {
    throw new Error("User is deleted");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if(!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }


  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  }

  const accessToken =  jwtUtils.createToken(
    jwtPayload as object, 
    config.jwt_secret as string, 
    config.jwt_access_expiration as string
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload as object,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiration as string
  );
  

  return {
    accessToken,
    refreshToken,
    user: await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id, 
      email: user.email || email,
    },
    omit : {
      password: true,
    }
  })
  }

}


const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret as string);

  if(!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }

  const {id, email} = verifiedRefreshToken.data as JwtPayload;
  const normalizedEmail = typeof email === "string" ? normalizeEmail(email) : email;


  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
      email: normalizedEmail,
    }
  })

  if(!user) {
    throw new Error("User not found");
  } else if(user.status === "SUSPENDED") {
    throw new Error("User is suspended");
  } else if(user.status === "BANNED") {
    throw new Error("User is banned");
  } else if(user.status === "DELETED") {
    throw new Error("User is deleted");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  } as JwtPayload;

  const newAccessToken = jwtUtils.createToken(
    jwtPayload, 
    config.jwt_secret as string, 
    config.jwt_access_expiration as string);

    return {accessToken: newAccessToken};
}



const getUserProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow
  ({
    where: {
      id: userId,
    },
    omit : {
      password: true,
    }
  });


  if(!user) {
    throw new Error("User not found");
  }

  return user;
}



export const authService = {
    registerUserIntoDB,
    loginUserFromDB,
    refreshToken,
    getUserProfileFromDB,
} 