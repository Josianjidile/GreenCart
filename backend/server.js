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

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Connect to services
connectDB();
connectCloudinary();

// ✅ Stripe webhook (must come before express.json())
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://greencart-dun.vercel.app"
];

// Update your CORS middleware to be more explicit
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    exposedHeaders: ['set-cookie']
  })
);

// ✅ Optional: log origin for debugging
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("API working");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
