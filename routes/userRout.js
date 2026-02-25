///to-do list/routes/userRout.js'
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
  refreshToken,
} = require("../controllers/userControllers");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { validateUser, userSchema } = require("../validators/userValidate");

router.post("/register", validateUser(userSchema), registerUser);
router.post("/verify", verifiction);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/verify", verifiction);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);
router.post("/refresh-token", refreshToken);

module.exports = router;
