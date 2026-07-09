import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/prisma/client.js";
import { landlordController } from "./controller.landlord.js";

const router = Router();

router.post("/properties", auth(UserRole.LANDLORD), landlordController.createProperties);



export const landlordRoutes = router;