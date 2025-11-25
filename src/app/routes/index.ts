// merges all modules routes

import { Router } from "express";
import { buildRouter } from "./routeBuilder";

// modules routes
import { userRoutes } from "@modules/user/routes/user.routes";

const router = Router();

router.use("/user", buildRouter(userRoutes));

export default router;
