import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator"; // Ensure validator is imported
import jwt from "jsonwebtoken"; 

// Function to create a JWT token
const createToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// User Registration 
export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the password length is at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create JWT token
    const token = createToken({ userId: user._id }, process.env.JWT_SECRET, "7d");

    // Set token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure this is set correctly
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Token expires after 7 days
    });

    res.status(201).json({
      token,
      message: "User registered successfully",
      user: { email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User Login Route
export const userLogin = async (req, res) => {
 

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Create JWT token
    let token;
    try {
      token = createToken({ userId: user._id }, process.env.JWT_SECRET, "7d");
    } catch (tokenError) {
      return res.status(500).json({ message: "Token generation failed" });
    }

    // Set token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure this is set correctly
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Token expires after 7 days
    });

    return res.json({success:true,
      token,
      message: "Login successful",
      user: { email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// Check auth: /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// Logout user
export const userLogout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Server error during logout" });
    }
};
