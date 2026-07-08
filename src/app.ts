import express, { type Application, type Request, type Response } from "express";
import { notFound } from "./middlewares/notFound.js";
import globalErrorsHandler from "./utils/globalErrorHandlers.js";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(notFound);

app.use(globalErrorsHandler);

export default app;
