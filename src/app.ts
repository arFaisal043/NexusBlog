import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";

const app: Application = express();

// Built in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

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


// ___________ All Routes

// prefix for auth api
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Use global error handler (Must be placed after all routes)
app.use(globalErrorHandler);

export default app;