import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { loginRateLimiter } from "../middleware/rateLimiter.middleware";

const AuthRoutes = Router();
const authController = new AuthController();

AuthRoutes.post('/register', authController.register);
AuthRoutes.post('/login', loginRateLimiter, authController.login);
AuthRoutes.post('/logout', authController.logout);
AuthRoutes.get('/profile', authMiddleware, authController.profile);

export default AuthRoutes;