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
