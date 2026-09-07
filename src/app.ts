import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.routes";
import { commentsRoutes } from "./modules/comment/comment.routes";
import { reactionRoutes } from "./modules/reaction/reaction.routes";
import { bookmarkRoutes } from "./modules/bookmark/bookmark.routes";
import { subscriptionRoutes } from "./modules/subscription/subscription.routes";

const app: Application = express();

// Security Middleware
app.use(helmet());

// Rate Limiting (limit repeated requests to APIs)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    status: "ERROR",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use("/api", apiLimiter);

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
    message: "Welcome to NexusBlog!",
  });
});


// ___________ All Routes _______________________

// prefix for auth api
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/subscription", subscriptionRoutes);


// Use global error handler (Must be placed after all routes)
app.use(globalErrorHandler);

export default app;