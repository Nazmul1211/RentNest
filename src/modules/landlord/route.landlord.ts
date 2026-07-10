import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/prisma/client.js";
import { landlordController } from "./controller.landlord.js";

const router = Router();

router.post("/properties", auth(UserRole.LANDLORD), landlordController.createProperties);
router.patch("/properties/:id", auth(UserRole.LANDLORD, UserRole.ADMIN), landlordController.updateProperties);
router.delete("/properties/:id", auth(UserRole.LANDLORD, UserRole.ADMIN), landlordController.deleteProperties);

export const landlordRoutes = router;