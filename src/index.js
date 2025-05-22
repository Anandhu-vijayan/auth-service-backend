import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from '../config/database.config.js';
import redis from '../config/redis.config.js';
import authRoutes from './routes/v1/auth.route.js'; // Check this path!
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true, // if you need to send cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Auth service is healthy" });
});

// Comment/uncomment these for diagnosis!
app.use("/api/v1/auth", authRoutes);
app.all("/{*any}", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorMiddleware);

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