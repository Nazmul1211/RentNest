import express from 'express';
import { auth } from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import { paymentController } from './controller.payment.js';


const router = express.Router();

router.post(
  '/create',
  auth(UserRole.TENANT),
  paymentController.createCheckoutSession
);

router.get(
  '/',
  auth(UserRole.TENANT, UserRole.ADMIN),
  paymentController.getPayments
);

router.get(
  '/:id',
  auth(UserRole.TENANT, UserRole.ADMIN),
  paymentController.getSinglePayment
);
export const paymentRoutes = router;
