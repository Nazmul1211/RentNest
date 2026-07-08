import express, { type Application, type Request, type Response } from "express";
import { notFound } from "./middlewares/notFound.js";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(notFound);

export default app;
