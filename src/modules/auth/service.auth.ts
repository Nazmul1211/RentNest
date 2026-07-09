import type { UserRole } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type { IUserPayload } from "./interface.auth.js";
import bcrypt from "bcrypt";
import config from "../../config/index.js";


const registerUserIntoDB = async (payload: IUserPayload) => {
  const {name, email, password, phone, role} = payload;

  // console.log(name, email, password, phone, role, "payload from registerUserIntoDB");

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email
    }
  })
  
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  const createUser = await prisma.user.create({
      data: {
        name, 
        email,
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
  const user = await prisma.user.findUnique({
    where: {
      email: email
    },
  })

  if(!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if(!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  return await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id, 
      email: user.email || email,
    },
    omit : {
      password: true,
    }
  })

}



export const authService = {
    registerUserIntoDB,
    loginUserFromDB,
}