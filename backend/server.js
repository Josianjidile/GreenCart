import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Allowed origins for frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://greencart-dun.vercel.app", // Your Vercel frontend
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS before any middleware
app.use(cors(corsOptions));

// Allow preflight for all routes
app.options("*", cors(corsOptions));

// Stripe webhook must be placed before JSON parser
app.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhooks);

// Normal middlewares
app.use(express.json());
app.use(cookieParser());

// Connect database and Cloudinary
(async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log("✅ Connected to MongoDB and Cloudinary");
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  }
})();

// Optional: rate limiting
try {
  const { default: rateLimit } = await import("express-rate-limit");
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100,
  });
  app.use(limiter);
  console.log("✅ Rate limiting enabled");
} catch (err) {
  console.log("ℹ️ Rate limiting not enabled (express-rate-limit not installed)");
}

// API Routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Default test route
app.get("/", (req, res) => {
  res.send("🚀 GreenCart API is running");
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// Start server
const server = app.listen(port, () =>
  console.log(`✅ Server running at http://localhost:${port}`)
);

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

export default app;
