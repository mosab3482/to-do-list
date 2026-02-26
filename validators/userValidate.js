const z = require("zod");

const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "User must be atlast of 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.email("Invali email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character",
    ),
});
const loginSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
  password: z.string().min(8, "Password is required"),
});
const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character",
    ),
  confirmPassword: z.string(),
});
const emailSchema = z.object({
  email: z.email("Invalid email address").toLowerCase(),
});
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^[0-9]{6}$/, "OTP must contain only numbers"),
});

const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.parse(req.body);
    next();
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e,
    });
  }
};
module.exports = {
  validateUser,
  userSchema,
  loginSchema,
  passwordSchema,
  emailSchema,
  otpSchema,
};
