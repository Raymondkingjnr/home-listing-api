import express from "express";
import rateLimit from "express-rate-limit";
import { DB_URL, JWT_SECRET, PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import connectMongoDB from "./database/mongodb.js";
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";

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
  res.send("welcome to home listing API");
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
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
    throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  }
};

const startServer = async () => {
  try {
    validateRequiredEnv();
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
