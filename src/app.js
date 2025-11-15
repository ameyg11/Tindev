
const connectDB = require("./config/database");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const profileEdit = require("./routes/profile")
const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const paymentRouter = require("./routes/payment");
require("dotenv").config();

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",profileEdit);
app.use("/",userRouter);
app.use("/", paymentRouter);
app.use("/upload", uploadRouter);



connectDB()
  .then(() => {
    console.log("database successfully connected");
    app.listen(process.env.PORT , () => {
      console.log("Server is running successfully running on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Error occured", err);
  });
