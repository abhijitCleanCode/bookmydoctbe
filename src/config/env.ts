function getEnv(name: string, required = true): string {
    const value = process.env[name];

    // handle value not found
    if (!value && required) {
        throw new Error(`❌ Environment variable "${name}" is required but not set.`);
    }

    return value!; // "!" telling ts it will be there, trust me
}

export const env = {
    NODE_ENV: getEnv("NODE_ENV", false) || "",
    PORT: parseInt(getEnv("PORT", false)) || 3000,

    CORS_ORIGIN: getEnv("CORS_ORIGIN"),

    ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET",),
    ACCESS_TOKEN_EXPIRY: getEnv("ACCESS_TOKEN_EXPIRY", false) || "1d",

    REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
    REFRESH_TOKEN_EXPIRY: getEnv("REFRESH_TOKEN_EXPIRY", false) || "7d",

    DATABASE_URI: getEnv("DATABASE_URI"),
    DATABASE_NAME: getEnv("DATABASE_NAME"),

    REDIS_URL: getEnv("REDIS_URL"),

    OTP_LENGTH: parseInt(getEnv("OTP_LENGTH", false)) || 6,
    OTP_TTL_SECONDS: parseInt(getEnv("OTP_TTL_SECONDS", false)) || 300,
    OTP_COOLDOWN_SECONDS: parseInt(getEnv("OTP_COOLDOWN_SECONDS", false)) || 60,
    OTP_MAX_ATTEMPTS: parseInt(getEnv("OTP_MAX_ATTEMPTS", false)) || 5,
    OTP_WORKER_CONCURRENCY: parseInt(getEnv("OTP_WORKER_CONCURRENCY", false)) || 3,

    RESEND_API_KEY: getEnv("RESEND_API_KEY"),
    RESEND_FORM: getEnv("RESEND_FORM", false) || "Bookmydoct <onboarding@resend.dev>",

    // add more as needed
}
