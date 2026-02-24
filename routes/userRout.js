const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifiction,
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOTP,
  changePassword,
} = require("../controllers/userControllers");
const { isAuthenticated } = require("../middleware/isAuthenticated");

router.post("/register", registerUser);
router.post("/verify", verifiction);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/verify", verifiction);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);

module.exports = router;
