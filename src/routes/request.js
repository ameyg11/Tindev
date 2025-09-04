const { userAuth } = require("./middleware/auth")


const express = require("express");

const requestRouter = express.Router();

app.post("/sendConnectionRequest", userAuth, async(req, res) => {

  const user = req.user;
  console.log(user);
  res.send(user.firstName + " sent a connection request");
})

module.exports = requestRouter;