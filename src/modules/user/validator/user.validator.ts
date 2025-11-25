import { JSONSchemaType } from "ajv";

export interface User {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
}
export const SignupUserSchema: JSONSchemaType<User> = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        phoneNumber: { type: "string" },
    },
    required: ["name", "email", "password"],
    additionalProperties: false,
};

export interface VerifyEmail {
    otpId: string;
    otp: string;
    userId: string;
}
export const VerifyEmailSchema: JSONSchemaType<VerifyEmail> = {
    type: "object",
    properties: {
        otpId: { type: "string" },
        otp: { type: "string" },
        userId: { type: "string" },
    },
    required: ["otpId", "otp", "userId"],
    additionalProperties: false,
}
