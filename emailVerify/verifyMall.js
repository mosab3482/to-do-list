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
  const htmlToSend = template({ token: encodeURIComponent(token) });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MALL_USER,
      pass: process.env.MALL_PASS,
    },
  });
  const mailConfigurations = {
    from: process.env.MALL_USER,
    to: email,
    subject: "Email Virifiaction",
    html: htmlToSend,
  };
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.log(error);
    }
    console.log("email is send seccessfly");
    console.log(info);
  });
};

module.exports = verifyMail;
