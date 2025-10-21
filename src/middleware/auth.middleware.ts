import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTUtil } from "../utils/jwt.util";
import { ResponseUtil } from "../utils/response.util";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return ResponseUtil.error(
                res,
                "No token provided",
                StatusCodes.UNAUTHORIZED
            );
        }

        const decoded = JWTUtil.verifyAccessToken(token);
        (req as any).user = decoded;
        next();
    } catch (error: any) {
        return ResponseUtil.error(
            res,
            "Invalid or expired token",
            StatusCodes.UNAUTHORIZED
        );
    }
};