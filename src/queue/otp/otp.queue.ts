import { Queue } from "bullmq";
import { queueConnection } from "queue/queue.config";

export const OTP_QUEUE_NAME = "otp-queue";

// queue: list of jobs waiting to be processed in round robin fashioned
export const otpQueue = new Queue(OTP_QUEUE_NAME, {
    ...queueConnection,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        removeOnComplete: { age: 3600 }, // avoid memory bloat
        removeOnFail: { age: 86400 } // avoid memory bloat
    }
})

// 2. add jobs
