const { validateSignUpData } = require("./utils/validations");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middleware/auth")


const express = require("express");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validating user
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt passwords
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Creating a new instance of a User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("new user logged In");
  } catch (err) {
    res.send("ERROR : " + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const {emailId, password} = req.body;
    
    const user = await User.findOne({ emailId });

    if(!user){
        throw new Error("Invalid creadentials!!");
    }

    const iSPasswordValid = await user.validatePassword(password);

    if(iSPasswordValid){

      // const token = await jwt.sign({ _id: user._id}, "tin@dev1110", {expiresIn: "30d"})
      const token = await user.getJWT();
      console.log(token);

      // Cookies
      res.cookie("token", token);

      res.send("Logged in successfully!!");
    }else{
      throw new Error("Invalid creadentials!!");
    }

  } catch (err) {
    res.send("ERROR : " + err);
  }
});


module.exports = authRouter;