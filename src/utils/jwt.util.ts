import jwt from "jsonwebtoken";

export interface JWTPayload {
    userId: number;
    email: string;
}

export class JWTUtil {
    private static accessSecret = process.env.JWT_ACCESS_SECRET || "rahasia";
    private static refreshSecret = process.env.JWT_REFRESH_SECRET || "rahasia_refresh";

    static generateAccessToken(payload: JWTPayload): string {
        return jwt.sign(payload, this.accessSecret, { expiresIn: "15m" });
    }

    static generateRefreshToken(payload: JWTPayload): string {
        return jwt.sign(payload, this.refreshSecret, { expiresIn: "7d" });
    }

    static verifyAccessToken(token: string): JWTPayload {
        return jwt.verify(token, this.accessSecret) as JWTPayload;
    }

    static verifyRefreshToken(token: string): JWTPayload {
        return jwt.verify(token, this.refreshSecret) as JWTPayload;
    }
}