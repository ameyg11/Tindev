require("dotenv").config();
const connectDB = require("./config/database");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());


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
