require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const redis = require("./config/redis");
const authRoutes = require("./routes/v1/auth.route");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Auth service is healthy" });
});

// Versioned API routing
app.use("/api/v1/auth", authRoutes);

// Fallback for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorMiddleware);

// Start server after DB connect
const startServer = async () => {
  try {
    await connectDB();
    redis.connect?.(); // Optional: If using connect() explicitly

    app.listen(PORT, () => {
      console.log(`Auth service running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
