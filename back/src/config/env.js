import dotenv from "dotenv";
import { z } from 'zod';
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  JWT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USERNAME: z.string(),
  SMTP_PASSWORD: z.string(),
  APP_URL: z.string(),
  FROM_EMAIL: z.string().email(),
  JWT_EXPIRES_IN: z.coerce.number().default(60 * 24),
  JWT_REFRESH_EXPIRES_IN: z.coerce.number().default(60 * 24 * 7)
});

let env;
try {
  env = envSchema.parse(process.env);
} catch (err) {
  console.log("err:", err);
  process.exit(1);
}

export default {
  env,
};
