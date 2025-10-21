import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { ResponseUtil } from "../utils/response.util";

export class AuthController {
    private authService = new AuthService();

    register = async (req: Request, res: Response) => {
        try {
            const validatedData = registerSchema.parse(req.body);
            const user = await this.authService.register(validatedData);

            return ResponseUtil.success(
                res,
                user,
                "User registered successfully",
                StatusCodes.CREATED
            );
        } catch (error: any) {
            if (error.name === "ZodError") {
                return ResponseUtil.error(
                    res,
                    "Validation error",
                    StatusCodes.BAD_REQUEST,
                    error.errors
                );
            }
            return ResponseUtil.error(
                res,
                error.message || "Registration failed",
                StatusCodes.BAD_REQUEST
            );
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const validatedData = loginSchema.parse(req.body);
            const { user, accessToken, refreshToken } = await this.authService.login(validatedData);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return ResponseUtil.success(
                res,
                { user },
                "Login successful"
            );
        } catch (error: any) {
            if (error.name === "ZodError") {
                return ResponseUtil.error(
                    res,
                    "Validation error",
                    StatusCodes.BAD_REQUEST,
                    error.errors
                );
            }
            return ResponseUtil.error(
                res,
                error.message || "Login failed",
                StatusCodes.UNAUTHORIZED
            );
        }
    };

    logout = async (req: Request, res: Response) => {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            return ResponseUtil.success(
                res,
                null,
                "Logout successful"
            );
        } catch (error: any) {
            return ResponseUtil.error(
                res,
                error.message || "Logout failed",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    };

    profile = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const user = await this.authService.getUserById(userId);

            return ResponseUtil.success(
                res,
                user,
                "Profile retrieved successfully"
            );
        } catch (error: any) {
            return ResponseUtil.error(
                res,
                error.message || "Failed to get profile",
                StatusCodes.NOT_FOUND
            );
        }
    };
}