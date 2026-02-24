const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(400).json({
            success: false,
            message:
              "Access token has expired, use refreshtoken to generate new one",
          });
        }
        return res.status(400).json({
          success: false,
          message: "Access token is missing or invalid",
        });
      }
      console.log(decoded);
      const { userId } = decoded;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      req.userId = user._id;
      next();
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { isAuthenticated };
