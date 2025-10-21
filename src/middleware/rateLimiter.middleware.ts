import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export const loginRateLimiter = rateLimit({
    store: new RedisStore({
        // @ts-ignore
        client: redis,
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

export const generalRateLimiter = rateLimit({
    store: new RedisStore({
        // @ts-ignore
        client: redis,
        prefix: "rl:general:"
    }),
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
});