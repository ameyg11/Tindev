const { userAuth } = require("../middleware/auth")
const { validateEditData } = require("../utils/validations")


const express = require("express");

const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async(req, res) => {
  const user = req.user;
  try{
    res.send(user)
  }catch (err) {
    res.send("" + err);
  }
  
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try{
    if(!validateEditData(req)){
      // throw new Error("Edits not allowed");
      res.status(400).send("Edits not allowed");
    };
    const loggedInUser = req.user;

    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    console.log(loggedInUser);
    res.json({
      message: "Profile updated successfully",
      data: loggedInUser
    }

    )
  }catch(err){
    res.status(400).send("" +err)
  }
})

module.exports = profileRouter;