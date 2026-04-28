import { config } from "dotenv";

const nodeEnv = process.env.NODE_ENV || "development";

if (nodeEnv === "development") {
  config({ path: `.env.local` });
}

export const {
  DB_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  NODE_ENV,
  FRONTEND_URL,
} = process.env;
