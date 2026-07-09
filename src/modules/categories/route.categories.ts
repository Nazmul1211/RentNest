import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client.js";
import { auth } from "../../middlewares/auth.js";
import { categoryController } from "./controller.categories.js";


const router = Router();

router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);
    
router.get("/", categoryController.getAllCategories);



export const categoryRoutes = router;

