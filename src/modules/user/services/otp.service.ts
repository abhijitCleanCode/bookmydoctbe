import crypto from "crypto";
import { redis } from "infra/redis";
import { ApiError } from "@core/ApiError";

const OTP_TTL = Number(process.env.OTP_TTL_SECONDS || 300);
const OTP_LEN = Number(process.env.OTP_LENGTH || 6);
// const OTP_COOLDOWN = Number(process.env.OTP_COOLDOWN_SECONDS || 60);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

const OTP_PREFIX = "otp:";
const ATTEMPT_PREFIX = "otp_attempt:";
// const COOLDOWN_PREFIX = "otp_cooldown:";
const BY_DEST_PREFIX = "otp_by_dest:";

// it is a utility function
function genNumericOtp(len = OTP_LEN) {
    const max = 10 ** len;
    const n = crypto.randomInt(0, max);
    return n.toString().padStart(len, "0");
}

function hashOtp(otp: string, salt: string) {
    return crypto.createHmac("sha256", salt).update(otp).digest("hex");
}

export class OtpService {
    static async createAndStoreOtp({
        userId,
        destination, // user's email
        channel = "email",
        reuseIfExists = false,
    }: {
        userId: string;
        destination: string;
        channel?: "email" | "sms";
        reuseIfExists?: boolean;
    }) {
        const otp = genNumericOtp();
        const salt = crypto.randomBytes(16).toString("hex");
        const hashed = hashOtp(otp, salt);
        const otpId = crypto.randomUUID();
        const key = `${OTP_PREFIX}${otpId}`;

        const payload = {
            otpId,
            userId,
            destination,
            channel,
            hashed,
            salt,
            createdAt: Date.now(),
            //* we do not store plaintext here; but will pass plaintext to job payload
        };

        await redis.set(key, JSON.stringify({ ...payload }), "EX", OTP_TTL);
        await redis.set(`${ATTEMPT_PREFIX}${otpId}`, "0", "EX", OTP_TTL);
        await redis.set(`${BY_DEST_PREFIX}${destination}`, key, "EX", OTP_TTL);

        return { otpId, otp };
    }

    static async verifyOtp(otpId: string, otpCandidate: string) {
        const key = `${OTP_PREFIX}${otpId}`;
        const raw = await redis.get(key);
        if (!raw) {
            throw new ApiError("OTP expired or not found", 400);
        }

        const data = JSON.parse(raw);
        const attemptsKey = `${ATTEMPT_PREFIX}${otpId}`;
        const attemptsRaw = await redis.get(attemptsKey);
        const attempts = attemptsRaw ? parseInt(attemptsRaw, 10) : 0;

        if (attempts >= OTP_MAX_ATTEMPTS) {
            throw new ApiError("OTP attempt limit exceeded", 429);
        }

        const candidateHash = hashOtp(otpCandidate, data.salt);
        const ok = crypto.timingSafeEqual(Buffer.from(candidateHash, "hex"), Buffer.from(data.hashed, "hex"));

        if (ok) {
            // on successful verification delete keys
            await redis.del(key, attemptsKey, `${BY_DEST_PREFIX}${data.destination}`);
            return true;
        } else {
            await redis.incr(attemptsKey);
            throw new ApiError("Invalid OTP", 400);
        }
    }
}
