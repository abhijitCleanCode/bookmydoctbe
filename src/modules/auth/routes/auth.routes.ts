import { RouteDefinition } from "@app/routes/route.type";
import authController from "../controllers/auth.controller";

export const authRoutes: RouteDefinition[] = [
    {
        path: "/me",
        controller: {
            get: authController.ME
        },
        version: "v1",
    }
]
