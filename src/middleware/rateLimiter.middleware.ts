import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log("Redis connected successfully");
    } catch (err) {
        console.error("Redis connection failed:", err);
    }
})();

const sendCommand = async (...args: string[]) => {
    return await redisClient.sendCommand(args) as any;
};

export const loginRateLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: sendCommand,
        prefix: "rl:login:"
    }),
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
});