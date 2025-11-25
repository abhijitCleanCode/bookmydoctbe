import { ApiError } from "@core/ApiError";
import { IUser, User } from "../models/user.model";
import { OtpService } from "./otp.service";
import { otpQueue } from "queue/otp/otp.queue";

class UserService {
  async signUp(payload: IUser) {
    const { email, location } = payload;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("User already exists", 409);
    }

    let geoLocation = undefined;
    if (location?.coordinates?.length === 2) {
      geoLocation = {
        type: "Point",
        coordinates: location.coordinates,
      };
    }

    const userDoc = await User.create([
      {
        ...payload,
        email,
        location: geoLocation,
      },
    ]);

    const newUser = userDoc[0].toObject();

    // delete newUser.password;

    // create otp in redis
    const { otpId, otp } = await OtpService.createAndStoreOtp({
      userId: newUser._id.toString(),
      destination: newUser.email,
      channel: "email",
    });

    // add job to queue
    await otpQueue.add("sendOtp", {
      otpId,
      plaintextOtp: otp,
      destination: newUser.email,
      channel: "email"
    }, { priority: 2 })

    return { newUser, otpId };
  }

  async verifyEmail(otpId: string, otp: string, userId: string) {
    const verified = await OtpService.verifyOtp(otpId, otp);
    if (!verified) {
      throw new ApiError("Invalid OTP", 400);
    }

    const user = await User.updateOne({ _id: userId }, { $set: { isEmailVerified: true } })

    return user
  }
}

export default new UserService();
