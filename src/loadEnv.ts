import dotenv from "dotenv";
import path from "path";

// loads .env for dev only
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
  });
}
