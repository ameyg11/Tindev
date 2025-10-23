const { Verification_Email_Template, Welcome_Email_Template } = require("../libs/EmailTemplate");
const { transporter } = require("./Email.config");


const SendVerificationCode=async(email, verificationCode) => {
    try{ 
        const response = await transporter.sendMail({
      from: '"TinDev" <11.editzs@gmail.com>',
      to: email,
      subject: "Verify Your Email",
      text: "Verify Your Email", // plain‑text body
      html: Verification_Email_Template.replace("{verificationCode}", verificationCode), // HTML body
    });
    console.log("Email send successfully", response);
    }catch(err){
      console.log(err)
    }
}

const WelcomeEmail=async(email, name) => {
    try{ 
        const response = await transporter.sendMail({
      from: '"TinDev" <11.editzs@gmail.com>',
      to: email,
      subject: "Welcome to TinDev 🎉",
      text: "Verify Your Email", // plain‑text body
      html: Welcome_Email_Template.replace("{name}", name), // HTML body
    });
    console.log("Email send successfully", response);
    }catch(err){
      console.log(err)
    }
}

module.exports = { SendVerificationCode, WelcomeEmail }