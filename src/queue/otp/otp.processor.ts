import { Job } from "bullmq"
import { sendMail } from "infra/mail/mailer";
import { redis } from "infra/redis";

export const otpProcessor = async (job: Job) => {
    const { otpId, plaintextOtp, destination, channel } = job.data;
    if (!otpId || !plaintextOtp || !destination) {
        throw new Error(`Invalid job data: ${JSON.stringify(job.data)}`);
    }

    // checking otp exists before sending mail
    const key = `otp:${otpId}`;
    const raw = await redis.get(key);
    if (!raw) {
        throw new Error(`OTP not found: ${otpId}`);
    }

    if (channel === "email") {
        console.log("mail to :: ", destination);
        const subject = "Verify your email to active your Bookmydoct account";
        const html = `<p>Your verification code is <strong>${plaintextOtp}</strong>. It expires in a few minutes. Thanks!</p>`;
        await sendMail({ to: destination, subject, text: plaintextOtp, html })
    }

    return { sentAt: Date.now() };
}
