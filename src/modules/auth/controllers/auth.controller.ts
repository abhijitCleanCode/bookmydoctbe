import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { ApiError } from "@core/ApiError";
import { ApiResponse } from "@core/ApiResponse";

class AuthController {
    private authService = AuthService;

    ME = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.get("authorization");
            const token = authHeader?.split(" ")[1] || req.cookies?.accessToken;

            if (!token) {
                throw new ApiError("Unauthorized", 401);
            }

            const data = await this.authService.me(token);

            return res.status(200).json(new ApiResponse(200, data, "Authecticated"));
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();
