import { Response, NextFunction } from "express";
import { ApiError } from "@core/ApiError";
import { User } from "@modules/user/models/user.model";
import { verifyAccessToken } from "@utils/jwt.utils";
import { AuthenticatedRequest } from "types";

export const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.get("authorization");
        const token = authHeader?.split(" ")[1] || req.cookies?.accessToken;

        console.log("app :: middleware :: auth.middleware :: verifyJWT :: token :: ", token);

        if (!token) {
            throw new ApiError("Unauthorized", 401);
        }

        const decodedToken = verifyAccessToken<{
            _id: string,
            email: string,
            isEmailVerified: boolean
            role: string
        }>(token);

        // querying should be done according to role in decodedToken
        const userInfo = await User.findById(decodedToken?._id).select("-password -session.refreshToken")

        if (!userInfo) {
            throw new ApiError("Unauthorized", 401);
        }

        req.user = {
            _id: userInfo._id.toString(),
            email: userInfo.email,
            isEmailVerified: userInfo.isEmailVerified!, // trust me it will be there
            role: userInfo.role!
        };

        next();
    } catch (error: unknown) {
        if (typeof error === "string") {
            throw new ApiError(error || "Unauthorized", 401);
        } else if (error instanceof Error) {
            throw new ApiError(error.message || "Unauthorized", 401);
        } else {
            throw new ApiError("An unexpected error occurred!", 401);
        }
    }
}