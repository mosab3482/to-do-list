const Session = require("../models/sessionModel");
const checkSession = async (req, res, next) => {
  try {
    const userId = req.userId;
    const session = Session.findOne({ userId });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }
    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
userSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 600, partialFilterExpression: { isVerified: false } },
);
module.exports = checkSession;
