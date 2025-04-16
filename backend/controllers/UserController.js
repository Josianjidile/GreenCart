import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

// 🔐 Helper to create JWT
const createToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

// ✅ Register New User
export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = createToken(
      { userId: user._id },
      process.env.JWT_SECRET,
      "7d"
    );

  // In both login and register endpoints, update cookie settings:
res.cookie("token", token, {
  httpOnly: true,
  secure: true, // Force secure in production
  sameSite: "none", // Required for cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: ".vercel.app" // Allow subdomains to access the cookie
});

    return res.status(201).json({
      success: true,
      token,
      message: "User registered successfully",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login User
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = createToken(
      { userId: user._id },
      process.env.JWT_SECRET,
      "7d"
    );

   // In both login and register endpoints, update cookie settings:
res.cookie("token", token, {
  httpOnly: true,
  secure: true, // Force secure in production
  sameSite: "none", // Required for cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: ".vercel.app" // Allow subdomains to access the cookie
});

    return res.json({
      success: true,
      token,
      message: "Login successful",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Check if Authenticated
export const isAuth = async (req, res) => {
  try {
    // Check both cookies and authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access Denied: No token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    return res.json({ 
      success: true, 
      user,
      token // Return the token in response as fallback
    });
  } catch (error) {
    console.error("Auth check error:", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

// ✅ Logout User
export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};
