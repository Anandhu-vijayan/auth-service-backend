import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from '../config/database.config.js'; // This now imports the function
import redis from '../config/redis.config.js';
import authRoutes from './routes/v1/auth.route.js'; // Comment out
import errorMiddleware from './middlewares/errorMiddleware.js'; // Keep for now, but watch

const app = express();
const PORT = process.env.PORT || 5000;

// Security middlewares - Keep these as they are not route related
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - COMMENT OUT TEMPORARILY
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
});
app.use("/api", limiter);

// Health check - COMMENT OUT TEMPORARILY
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Auth service is healthy" });
});

// Routes - COMMENT OUT ALL OF THESE
app.use("/api/v1/auth", authRoutes);

// Fallback - COMMENT OUT TEMPORARILY
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler - COMMENT OUT TEMPORARILY IF THE ERROR PERSISTS
app.use(errorMiddleware); // You might want to try commenting this out too if the error remains after other steps

const startServer = async () => {
  try {
    await connectDB();
    // redis.connect?.();

    app.listen(PORT, () => {
      console.log(`Auth service running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();