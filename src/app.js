require("dotenv").config();
const connectDB = require("./config/database");
const express = require("express");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth")

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async(req, res) => {
  const user = req.user;
  try{
    res.send(user)
  }catch (err) {
    res.send("" + err);
  }
  
})

app.post("/sendConnectionRequest", userAuth, async(req, res) => {

  const user = req.user;
  console.log(user);
  res.send(user.firstName + " sent a connection request");
})

connectDB()
  .then(() => {
    console.log("database successfully connected");
    app.listen(7777, () => {
      console.log("Server is running successfully running on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Error occured", err);
  });
