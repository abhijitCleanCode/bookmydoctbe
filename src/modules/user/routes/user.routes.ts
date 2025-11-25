import type { RouteDefinition } from "@app/routes/route.type";
import userController from "../controllers/user.controller";
import { validate } from "@app/middlewares/validate.middleware";
import { SignupUserSchema, VerifyEmailSchema } from "../validator/user.validator";

export const userRoutes: RouteDefinition[] = [
    {
        path: "/signup",
        controller: {
            post: userController.SIGN_UP
        },
        validators: {
            post: validate(SignupUserSchema),
        },
        version: "v1",
    },
    {
        path: "/verify-email",
        controller: {
            post: userController.VERIFY_EMAIL
        },
        validators: {
            post: validate(VerifyEmailSchema),
        },
        version: "v1",
    }
]
