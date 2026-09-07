import express, { Application, request, Request, Response } from "express";
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
import { stripe } from "./lib/stripe";

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



// __________ stripe webhook routes
const endpointSecret = config.stripe_webhook_secret;

app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {

    let event = request.body;
    console.log(event, "Stripe request body"); // --> here we get Event Buffer
    console.log(request.headers, "Stripe request headers");

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"]!;
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret,
        );
      } 
      catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400).json({
          message: err.message
        })
      }
    }

    console.log(event, "Event after try block");

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);

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