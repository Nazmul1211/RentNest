import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";
import { authController } from "./controller.auth.js";


const router = Router();

// router.post("/api/auth/register", auth(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), authController.registerUser);

router.post("/register", authController.registerUser);




export const authRoutes = router; 