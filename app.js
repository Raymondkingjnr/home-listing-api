import express from "express";
import rateLimit from "express-rate-limit";
import { DB_URL, JWT_SECRET, PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import connectMongoDB from "./database/mongodb.js";
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import propertyRouter from "./routes/property.route.js";
import commentRouter from "./routes/comment.route.js";

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many  please try again after 15 minutes",
});
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// app.options("(.*)", cors(corsOptions));

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Home Listing API",
    routes: [
      {
        method: "GET",
        path: "/",
        description: "API route index",
      },
      {
        method: "GET",
        path: "/health",
        description: "Health check",
      },
      {
        method: "POST",
        path: "/api/v1/auth/register",
        description: "Register a new user",
      },
      {
        method: "PUT",
        path: "/api/v1/auth/login",
        description: "Login user",
      },
      {
        method: "POST",
        path: "/api/v1/auth/forgot-password",
        description: "Request password reset",
      },
      {
        method: "POST",
        path: "/api/v1/auth/createNewPassword",
        description: "Create new password",
      },
      {
        method: "PATCH",
        path: "/api/v1/auth/changePassword",
        description: "Change password (auth required)",
      },
      {
        method: "GET",
        path: "/api/v1/profile/get-user",
        description: "Get current user profile (auth required)",
      },
      {
        method: "GET",
        path: "/api/v1/profile/user/:userId",
        description: "Get profile by user ID",
      },
      {
        method: "GET",
        path: "/api/v1/profile/get-all-profiles",
        description: "Get all profiles",
      },
      {
        method: "PATCH",
        path: "/api/v1/profile/update-user/:userId",
        description: "Update a profile (auth required)",
      },
      {
        method: "GET",
        path: "/api/v1/property/get-all-properties",
        description: "Get all properties",
      },
      {
        method: "POST",
        path: "/api/v1/property/create-property/",
        description: "Create a property (auth required)",
      },
      {
        method: "GET",
        path: "/api/v1/property/get-single-property/:propertyId",
        description: "Get one property by ID",
      },
      {
        method: "PATCH",
        path: "/api/v1/property/update-property",
        description: "Update property (auth required)",
      },
      {
        method: "GET",
        path: "/api/v1/property/get-user-properties/:userId",
        description: "Get properties for a user (auth required)",
      },
      {
        method: "DELETE",
        path: "/api/v1/property/delete-property/:propertyId",
        description: "Delete a property (auth required)",
      },
      {
        method: "POST",
        path: "/api/v1/comment/post-comment/:propertyId",
        description: "Post comment on a property (auth required)",
      },
      {
        method: "GET",
        path: "/api/v1/comment/get-property-comments/:propertyId",
        description: "Get property comments",
      },
      {
        method: "DELETE",
        path: "/api/v1/comment/delete-comment/:commentId",
        description: "Delete comment (auth required)",
      },
    ],
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/comment", commentRouter);
app.use(errorMiddleware);

const validateRequiredEnv = () => {
  const requiredEnv = {
    DB_URL,
    JWT_SECRET,
    PORT,
  };

  const missingEnv = Object.entries(requiredEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingEnv.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnv.join(", ")}`,
    );
  }
};

const startServer = async () => {
  try {
    validateRequiredEnv();
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
