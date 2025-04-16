import jwt from 'jsonwebtoken';

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Verify credentials
    if (email === process.env.SELLER_EMAIL &&
        password === process.env.SELLER_PASSWORD) {
      
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Set cookie
      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ 
        success: true, 
        message: 'Login successful',
        token
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: "Invalid credentials" 
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error'  // This is the critical fix
    });
  }
};



// Check auth: /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
    
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};



// Logout seller
export const sellerLogout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('sellerToken', {  
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.json({ success: true, message: "seller logged out successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Server error during logout" });
    }
};

