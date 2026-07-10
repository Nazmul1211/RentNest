import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { rentalController } from "./controller.rental.js";


const router = Router()

router.post("/", auth(UserRole.TENANT), rentalController.createRentalRequest);
router.get("/", auth(UserRole.TENANT), rentalController.getRentalRequests);
router.get("/:id", auth(UserRole.TENANT), rentalController.getRentalRequestById);



export const rentalRoutes = router;