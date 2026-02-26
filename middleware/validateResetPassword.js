const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const validateResetPassword = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);
      if (!decoded.email) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
      }
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      req.user = user;
      req.email = user.email;
      next();
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Password reset token expired",
          code: "TOKEN_EXPIRED",
        });
      }
      if (e.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token verification failed",
      });
    }
  } catch (err) {
    console.error("Password reset token middleware error:", e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
module.exports = validateResetPassword;
