require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const verifyMail = async (token, email) => {
  const emailTemplateSourse = fs.readFileSync(
    path.join(__dirname, "template.hbs"),
    "utf-8",
  );
  const template = handlebars.compile(emailTemplateSourse);
  const htmlToSend = template({
    token: encodeURIComponent(token),
    baseUrl: process.env.BASE_URL,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    html: htmlToSend,
  };
  try {
    const info = await transporter.sendMail(mailConfigurations);
    console.log("Email sent successfully");
    console.log(info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
module.exports = verifyMail;
