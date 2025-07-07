import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

// dotenv.config({
//   path: path.resolve(__dirname, "../../.env"),
// });
const envConfig = dotenv.parse(
  fs.readFileSync(path.join(__dirname, "../../", ".env"))
);

for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

export const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET_VORAME: process.env.JWT_SECRET_VORAME,
  FRONTEND_URL: process.env.FRONTEND_URL,
  MAILUSER: process.env.MAILUSER,
  MAILPASS: process.env.MAILPASS,
  MAILHOST: process.env.MAILHOST,
  MAILPORT: process.env.MAILPORT,
  SENDEREMAIL: process.env.SENDEREMAIL,
  TOKENEXPIRE: process.env.TOKENEXPIRE,
  BACKEND_URL: process.env.BACKEND_URL,
  MAIL_FROM: process.env.EMAIL_FROM,
  ADMIN_MAIL: process.env.ADMINMAIL,
  STRIPE_API_KEY: process.env.STRIPE_API_KEY,
  INSTAGRAM_LOGO: process.env.INSTAGRAM_MAIL_ICON,
  FACEBOOK_LOGO: process.env.FACEBOOK_MAIL_ICON,
  TWITTER_LOGO: process.env.TWITTER_MAIL_ICON,
  SCHESTI_LOGO: process.env.SCHESTI_MAIL_ICON,
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
} as const;
