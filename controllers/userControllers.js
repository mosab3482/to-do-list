const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyMail = require("../emailVerify/verifyMall");
const sendOtpMail = require("../emailVerify/sendOtpMail");
const Session = require("../models/sessionModel");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.REGISTER_SECRET, {
      expiresIn: "10m",
    });
    verifyMail(token, email);
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully. check your email to verify",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const verifiction = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REGISTER_SECRET);
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Register token expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verificaton failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
      await Session.deleteOne({ userId: user._id });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "1h",
      },
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );
    await Session.create({ userId: user._id, refreshToken });
    user.isLoggedIn = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.username}`,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;
    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expire = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOTP = await bcrypt.hash(otp, 10);
    user.otp = hashedOTP;
    user.otpExpiry = expire;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({
      success: true,
      message: "OTP send to your email",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is requried",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not genrated",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one",
      });
    }
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    const passwordResetToken = jwt.sign(
      { email: user.email },
      process.env.PASSWORD_RESET_SECRET,
      { expiresIn: "10m" },
    );
    return res.status(200).json({
      success: true,
      message: "OTP verified successfuly",
      passwordResetToken,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }
    const user = req.user;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfuly",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      if (!user.isLoggedIn) {
        return res.status(401).json({
          success: false,
          message: "User is not logged in. Please login again",
        });
      }
      const session = await Session.findOne({ userId: user._id });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again",
        });
      }
      if (session.refreshToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token ",
        });
      }
      const newAccessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "1h" },
      );
      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
      });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Refresh token expired. please login again",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
module.exports = {
  registerUser,
  verifiction,
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOTP,
  changePassword,
  refreshTokenController,
};
