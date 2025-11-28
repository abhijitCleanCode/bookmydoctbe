/*
this file act as a single source of truth for fe to determine
who is the current logged in user.
*/

import { ApiError } from "@core/ApiError";
import { User } from "@modules/user/models/user.model";
import { verifyAccessToken } from "@utils/jwt.utils";

export class AuthService {
  async me(accessToken: string) {
    let decodedToken;
    try {
      decodedToken = verifyAccessToken<{
        _id: string;
        email: string;
        isEmailVerified: boolean;
        role: string;
      }>(accessToken);
    } catch (error: any) {
      // token expired: call refresh token api
      if (error.message === "ACCESS_TOKEN_EXPIRED") {
        throw new ApiError("Access token expired", 401);
      }

      throw new ApiError("Invalid access token", 401);
    }

    const userInfo = await User.findById(decodedToken?._id).select(
      "-password -session.refreshToken"
    );
    if (!userInfo) {
      throw new ApiError("User not found", 404);
    }

    return userInfo;
  }
}

export default new AuthService();
