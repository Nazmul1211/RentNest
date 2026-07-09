import express, { type Application, type Request, type Response } from "express";
import { notFound } from "./middlewares/notFound.js";
import globalErrorsHandler from "./utils/globalErrorHandlers.js";
import { authRoutes } from "./modules/auth/route.auth.js";
import config from "./config/index.js";
import cors from "cors";

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

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(notFound);

app.use(globalErrorsHandler);

export default app;
