import "../../loadEnv";

import { Worker } from "bullmq";
import { OTP_QUEUE_NAME } from "./otp.queue";
import { otpProcessor } from "./otp.processor";
import { env } from "@config/env";
import { queueConnection } from "@queue/queue.config";

const concurrency = env.OTP_WORKER_CONCURRENCY || 3;

const otpWorker = new Worker(OTP_QUEUE_NAME, async (job) => otpProcessor(job), {
  ...queueConnection,
  concurrency,
  limiter: { max: 3, duration: 1000 },
});

otpWorker.on("completed", job => {
  console.log(`OTP job ${job.id} completed`);
});
otpWorker.on("failed", (job, err) => {
  console.error(`OTP job ${job?.id} failed:`, err);
});
