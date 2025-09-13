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
        });
    
        res.json({message: "Data fetched successfully", data: connectionRequests});
    }catch(err){
        res.status(400).send("Error", +err)
    }

});

module.exports = userRouter;