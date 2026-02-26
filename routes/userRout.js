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
const {
  validateUser,
  userSchema,
  loginSchema,
  passwordSchema,
  emailSchema,
  otpSchema,
} = require("../validators/userValidate");

router.post("/register", validateUser(userSchema), registerUser);
router.post("/verify", verifiction);

router.post("/login", validateUser(loginSchema), loginUser);
router.post("/logout", isAuthenticated, logoutUser);

router.post("/forgot-password", validateUser(emailSchema), forgotPassword);
router.post("/verify-otp/:email", validateUser(otpSchema), verifyOTP);
router.post(
  "/change-password/:email",
  validateUser(passwordSchema),
  changePassword,
);
router.post("/refresh-token", refreshToken);

module.exports = router;
