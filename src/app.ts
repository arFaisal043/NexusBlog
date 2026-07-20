import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config";

const app: Application = express();

// Built in Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);


// ___________ Root Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "This is Root Routes",
  });
});


export default app;