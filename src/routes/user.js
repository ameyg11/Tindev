const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async(req, res) => {

    try{
        const loggedInUser = req.user;
    
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl" , "age", "gender", "about", "skills"]); // you can also add in form of a string instead of array like "lastName photoUrl"
    
        res.json({message: "Data fetched successfully", data: connectionRequests});
    }catch(err){
        res.status(400).send("Error", +err)
    }

});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser,
            status: "accepted",
        }).populate("fromUserId");

        res.send({message: "Data fetched successfully", data:connectionRequests});
    }catch(err){
        res.status(400).send("Error" +err);
    }
})

module.exports = userRouter;