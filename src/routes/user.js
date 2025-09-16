const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async(req, res) => {

    try{
        const loggedInUser = req.user;
    
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA); // you can also add in form of a string instead of array like "lastName photoUrl"
    
        res.json({message: "Data fetched successfully", data: connectionRequests});
    }catch(err){
        res.status(400).send("Error", +err)
    }

});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            $or:[
               { toUserId: loggedInUser._id, status: "accepted" },
               { fromUserId: loggedInUser._id, status: "accepted" }
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        console.log(connectionRequests);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        

        res.json({message: "Data fetched successfully", data});
    }catch(err){
        res.status(400).send("Error" +err);
    }
})

module.exports = userRouter;