const { userAuth } = require("../middleware/auth")


const express = require("express");

const profileRouter = express.Router();


profileRouter.get("/profile", userAuth, async(req, res) => {
  const user = req.user;
  try{
    res.send(user)
  }catch (err) {
    res.send("" + err);
  }
  
})

module.exports = profileRouter;