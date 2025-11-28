import { env } from "@config/env";
import jwt from "jsonwebtoken";
import { StringValue } from "types/jwt.type";

export function generateAccessToken<T extends object>(
  payload: T,
  expiresIn?: StringValue
): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: expiresIn || "1d",
  });
}

export function verifyAccessToken<T extends object>(token: string): T {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as T;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("ACCESS_TOKEN_EXPIRED");
    }
    throw new Error("ACCESS_TOKEN_INVALID");
  }
}

export function generateRefreshToken<T extends object>(
  payload: T,
  expiresIn?: StringValue
): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: expiresIn || "7d",
  })
}

export function verifyRefreshToken<T extends object>(token: string): T {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as T;
}
