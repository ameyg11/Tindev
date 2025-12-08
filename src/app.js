const connectDB = require("./config/database");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

app.use(
  cors({
    origin: [
      "http://localhost:5173", // desktop Vite
      "http://127.0.0.1:5173", // alternate
      "http://192.168.1.5:5173", // ← REPLACE WITH YOUR PC LAN IP (for mobile)
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const profileEdit = require("./routes/profile");
const userRouter = require("./routes/user");
const uploadRouter = require("./routes/upload");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/Socket");
const chatRouter = require("./routes/chat");

require("dotenv").config();

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", profileEdit);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);
app.use("/upload", uploadRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("database successfully connected");
    server.listen(process.env.PORT, () => {
      console.log("Server is running successfully running on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Error occured", err);
  });
