import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppDataSource } from "./data-source";
import routes from "./routes/index";
import { generalRateLimiter } from "./middleware/rateLimiter.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalRateLimiter);

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });