import express, { type Application, type Request, type Response } from "express";
import { notFound } from "./middlewares/notFound.js";
import globalErrorsHandler from "./utils/globalErrorHandlers.js";
import { authRoutes } from "./modules/auth/route.auth.js";
import config from "./config/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { categoryRoutes } from "./modules/categories/route.categories.js";
import { landlordRoutes } from "./modules/landlord/route.landlord.js";
import { propertyRoutes } from "./modules/properties/route.properties.js";
import { rentalRoutes } from "./modules/rentalRequest/route.rental.js";
import { adminRoutes } from "./modules/admin/route.admin.js";
import { paymentRoutes } from "./modules/payment/route.payment.js";
import { paymentController } from "./modules/payment/controller.payment.js";

const app: Application = express();

app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);


app.post(
  '/api/payments/confirm',
  express.raw({ type: '*/*' }),
  paymentController.confirmPayment
);


// added middleware to parse JSON and URL-encoded data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(notFound);

app.use(globalErrorsHandler);

export default app;
