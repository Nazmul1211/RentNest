import type { UserRole } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type { IUserPayload } from "./interface.auth.js";
import bcrypt from "bcrypt";
import config from "../../config/index.js";


const registerUserIntoDB = async (payload: IUserPayload) => {
  const {name, email, password, phone, role} = payload;

  console.log(name, email, password, phone, role, "payload from service.user.ts");

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


export const authService = {
    registerUserIntoDB,
}