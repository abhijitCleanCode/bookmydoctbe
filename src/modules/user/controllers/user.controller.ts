import { Request, Response, NextFunction } from "express";

import userService from "../services/user.service";
import { ApiResponse } from "@core/ApiResponse";

class UserController {
  private userService = userService;

  // arrow fn here bind "this" to class whereas normal fn bind "this" to express
  SIGN_UP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.signUp(req.body);

      return res
        .status(201)
        .json(new ApiResponse(201, user, "User registered!"));
    } catch (error) {
      next(error);
    }
  };

  VERIFY_EMAIL = async (req: Request, res: Response, next: NextFunction) => {
    const { otpId, otp, userId } = req.body;

    try {
      const data = await this.userService.verifyEmail(otpId, otp, userId);

      return res.status(200).json(new ApiResponse(200, data, "OTP verified!"));
    } catch (error) {
      next(error);
    }
  };

  LOGIN = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const { user, accessToken, refreshToken } = await this.userService.login(
        email,
        password
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, user, "User logged in!"));
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
