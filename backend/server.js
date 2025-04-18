import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Corrected import
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";


// Initialize dotenv to load environment variables
dotenv.config();


// App configuration
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
connectCloudinary()


const allowedOrigins = ["http://localhost:5173", "https://greencart-dun.vercel.app"];
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);


// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin:allowedOrigins,credentials: true }))


// API endpoints
app.use("/api/user",userRouter)
app.use("/api/seller",sellerRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/address",addressRouter)



app.get('/', (req, res) => {
  res.send("API working");
});

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
