const { validateSignUpData } = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");

const express = require("express");
const { SendVerificationCode, WelcomeEmail } = require("../middleware/Email");
const authRouter = express.Router();

// --- Signup with OTP ---
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    // check if already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      verificationCode,
      isVerified: false,
    });

    await user.save();

    await SendVerificationCode( emailId, verificationCode);

    return res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid creadentials!!");
    }

    const iSPasswordValid = await user.validatePassword(password);

    if (iSPasswordValid) {
      // const token = await jwt.sign({ _id: user._id}, "tin@dev1110", {expiresIn: "30d"})
      const token = await user.getJWT();
      // console.log(token);

      // Cookies
      res.cookie("token", token);

      res.send(user);
    } else {
      throw new Error("Invalid creadentials!!");
    }
  } catch (err) {
      res.status(401).json({message: "Invalid Credentials"});
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfully!!");
});


// --- Verify OTP ---
authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { emailId, otp } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) return res.status(400).json({ success: false, message: "User not found" });
    if (user.verificationCode !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    await WelcomeEmail(user.emailId, user.firstName);


    const token = await user.getJWT();
    res.cookie("token", token);

    return res.json({ success: true, message: "Email verified", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});


module.exports = authRouter;
