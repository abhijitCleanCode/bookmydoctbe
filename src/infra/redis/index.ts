import IORedis from "ioredis";
import { env } from "@config/env";

const redisUrl = env.REDIS_URL;

// guard
if (!redisUrl) {
    throw new Error('REDIS_URL environment variable is not set');
}

export const redis = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});
