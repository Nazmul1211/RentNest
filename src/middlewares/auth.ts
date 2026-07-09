
import type { Request } from "express";
import { jwtUtils } from "../utils/jwt.js";
import catchAsync from "../utils/catchAsync.js";
import config from "../config/index.js";
import type { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "../../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: UserRole;
                status: string;
            }
        }
    }
}

export const auth = (...requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res, next) => {

    const token = req.cookies?.AccessToken ? req.cookies.AccessToken : req.headers.authorization?.startsWith("Bearer") 
    ? req.headers.authorization.split(" ")[1]
    : req.headers.authorization;

    if(!token) {
        throw new Error("You are not logged in, please login  to access this resource");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_secret as string); 

     if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const {id, name, email, role, status} = verifiedToken.data as JwtPayload;

    if(requiredRoles.length > 0 && !requiredRoles.includes(role as UserRole)) {
        throw new Error("Forbidden. You don't have permission to access this resources");

    }

    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id,
            name,
            email,
            role,
            status,
        }
    })

    if(!user) {
        throw new Error("User not found. Please login again to access this resource");
    }

    if (user.status === "SUSPENDED") {
        throw new Error("Your account is suspended. Please contact support for assistance.");
    } else if (user.status === "BANNED") {
        throw new Error("Your account is banned. Please contact support for assistance.");
    } else if (user.status === "DELETED") {
        throw new Error("Your account has been deleted. Please contact support for assistance.");
    }

    req.user = {
        id,
        name, 
        email,
        role,
        status,
    }

    next();
})
}