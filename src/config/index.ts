import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const config = {
  port: process.env.PORT,
  connectionString: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN,
  refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
};
