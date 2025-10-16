const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // you can also add in form of a string instead of array like "lastName photoUrl"

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error", +err);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "Data fetched successfully", data });
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50 : limit;
    const skip = (page-1)*limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");                                               // .populate("fromUserId", "firstName").populate("toUserId", "firstName");


    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
        $and: [
            {_id: { $nin: Array.from(hideUsersFromFeed)}},                 // nin => not in array, ne => not equal to 
            {_id: { $ne: loggedInUser._id }}
        ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    // console.log(hideUsersFromFeed);
    res.send(users)
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

module.exports = userRouter;
