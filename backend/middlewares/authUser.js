import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    // Initialize req.body if undefined (for GET requests)
    if (!req.body) req.body = {};
    
    // Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access Denied: No token provided" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Safely set userId
    req.body.userId = decoded.userId || decoded.id; // Handles both 'userId' and 'id'
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error.message.includes("jwt") 
        ? "Invalid or expired token" 
        : error.message 
    });
  }
};

export default authUser;