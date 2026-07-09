import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";
import { authController } from "./controller.auth.js";
import { auth } from "../../middlewares/auth.js";


const router = Router();

router.post("/register",authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/me", auth(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), authController.getMyProfile);


export const authRoutes = router;  