import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";
import { adminController } from "./controller.admin.js";
import { auth } from "../../middlewares/auth.js";


const router = Router()


router.get("/users", auth(UserRole.ADMIN), adminController.getAllUser)

router.patch("/users/:id", auth(UserRole.ADMIN), adminController.updateUserStatus) 

router.get("/properties", auth(UserRole.ADMIN), adminController.getAllProperties ) 

router.get("/rentals", auth(UserRole.ADMIN), adminController.getAllRentalRequests) 


export const adminRoutes = router;


