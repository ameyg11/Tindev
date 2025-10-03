const { userAuth } = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest");

const express = require("express");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth, 
  async(req, res) => {
    try{
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // if(fromUserId == toUserId) return res.status(400).json({message: "You are who you are : Cannot send request to same user"})

      const toUser = await User.findById( toUserId );
      if(!toUser){
        return res.status(400).json({message: "User does not exists"})
      }

      const allowedStatus = ["interested", "ignored"];
      if(!allowedStatus.includes(status)){
        return res
          .status(400)
          .json({message: "Invalid status type: " +status});
      };

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:
        [ { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      });


      if(existingConnectionRequest){
        return res
          .status(400)
          .json({message: "Connection request already exists"})
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({ 
        message: req.user.firstName +  " is " + status+ " in " + toUser.firstName,
        data: data
      })

    }catch(err){
      res.status(400).send(""+err)
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {

  try{

    const loggedInUser = req.user;
    const { status, requestId } = req.params;
  
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({ message: "Invalid request status!"})
    }
  
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found"})
    }  
  
    connectionRequest.status = status;
  
    const data = await connectionRequest.save();

    res.json({message: "Connection request "+status , data: data})

  }catch(err) {
    res.send("ERROR : " + err);
  }

})


module.exports = requestRouter;