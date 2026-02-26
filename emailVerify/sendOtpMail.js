require("dotenv").config();
const nodemailer = require("nodemailer");

const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password reset OPT",
    html: `<p>Your OTP reset password is:<b>${otp}</b>. It is valid for 10 minutes.</p>`,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendOtpMail;
