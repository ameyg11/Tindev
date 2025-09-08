const { userAuth } = require("../middleware/auth")
const ConnectionRequestModel = require("../models/connectionRequest");

const express = require("express");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth, 
  async(req, res) => {
    try{
      const fromUserId = req.user._id;
    }catch{
      res.status(400).send("")
    }
})

module.exports = requestRouter;