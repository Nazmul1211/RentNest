import { Router } from "express";
import { propertyController } from "./controller.properties.js";


const router = Router();

router.get("/", propertyController.getProperties);
router.get("/:id", propertyController.getPropertyById);

export const propertyRoutes = router;