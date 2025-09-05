require("dotenv").config();
const connectDB = require("./config/database");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const profileEdit = require("./routes/profile")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",profileEdit);






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
