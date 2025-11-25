import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "@config/env";
import { errorHandler } from "@app/middlewares/error.middleware";
import routes from "@app/routes";

const app = express();

// configure middleware
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// application routes
app.use("/api/v1", routes);

// error handler
app.use(errorHandler)

export { app };
