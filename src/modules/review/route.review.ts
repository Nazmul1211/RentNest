import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums.js";
import { auth } from "../../middlewares/auth.js";
import { reviewController } from "./controller.review.js";


const router = Router();


router.post(
    "/",
    auth(UserRole.TENANT),
    reviewController.createReview,
);

router.get(
    "/",
    reviewController.getReviews,
);

router.get(
    "/:id",
    reviewController.getSingleReview,
);

router.patch(
    "/:id",
    auth(UserRole.TENANT),
    reviewController.updateReview,
);

router.delete(
    "/:id",
    auth(UserRole.TENANT, UserRole.ADMIN),
    reviewController.deleteReview,
);



export const reviewRoutes = router;