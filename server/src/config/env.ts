import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["PORT", "DATABASE_URL", "JWT_SECRET"] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT),
  DATABASE_URL: String(process.env.DATABASE_URL),
  JWT_SECRET: String(process.env.JWT_SECRET),
};
