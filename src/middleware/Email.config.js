const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "11.editzs@gmail.com",
    pass: "lngd zaqk ozyq pkyl", // App password only!
  },
});

module.exports = { transporter };
