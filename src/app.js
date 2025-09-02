require("dotenv").config();
const connectDB = require("./config/database");
const express = require("express");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

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

    const iSPasswordValid = await bcrypt.compare(password, user.password);

    if(iSPasswordValid){

      // JWT tokens

      const token = await jwt.sign({ _id: user._id}, "tin@dev1110")
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

app.get("/profile", async(req, res) => {

  const cookies = req.cookies;
  try{
  
    const {token} = cookies;
    if(!token){
      throw new Error("No token found");
    }
  
    const decodedMessage = await jwt.verify(token, "tin@dev1110");
  
    const { _id } = decodedMessage;
    
    const user = await User.findById(_id);

    if(!user){
      throw new Error("Please log in");
    }
  
    res.send(user)
  }catch (err) {
    res.send("" + err);
  }
  
})

// getting data from database
app.get("/user", async (req, res) => {
  const userMail = req.body.emailID;

  try {
    const user = await User.find({ emailId: userMail });
    res.send(user);
  } catch (err) {
    res.send("Something Went Wrong");
  }
});

app.get("/feed", async (req, res) => {
  // const userMail = req.body.emailID;

  try {
    const user = await User.find({});
    res.send(user);
    // console.log(user)
  } catch (err) {
    res.send("Something Went Wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userID = req.body.userId;

  try {
    await User.findByIdAndDelete(userID);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "age", "skills"];
    const isUpdatedAllowed = Object.keys(data).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    if (!isUpdatedAllowed) {
      throw new Error("Updates of this field are not allowed");
    }

    if (data.skills.length > 10) {
      throw new Error("Skills should be less than 5");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
    console.log(user);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

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
