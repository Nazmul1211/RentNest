import express, { type Application, type Request, type Response } from "express";
import { notFound } from "./middlewares/notFound.js";
import globalErrorsHandler from "./utils/globalErrorHandlers.js";
import { authRoutes } from "./modules/auth/route.auth.js";
import config from "./config/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { categoryRoutes } from "./modules/categories/route.categories.js";

const app: Application = express();

app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);

// added middleware to parse JSON and URL-encoded data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(notFound);

app.use(globalErrorsHandler);

export default app;
