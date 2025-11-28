// merges all modules routes

import { Router } from "express";
import { buildRouter } from "./routeBuilder";

// modules routes
import { userRoutes } from "@modules/user/routes/user.routes";
import { authRoutes } from "@modules/auth/routes/auth.routes";

const router = Router();

router.use("/user", buildRouter(userRoutes));
router.use("/auth", buildRouter(authRoutes));

export default router;
