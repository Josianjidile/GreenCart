import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  try {
    const sellerToken = req.cookies.sellerToken;

    if (!sellerToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Seller authentication required" 
      });
    }

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized seller account"
      });
    }

    req.seller = {
      email: decoded.email
    };

    next();
  } catch (error) {
    const message = error.name === "TokenExpiredError" 
      ? "Seller session expired" 
      : "Invalid seller token";

    res.status(401).json({ success: false, message });
  }
};

export default authSeller;
