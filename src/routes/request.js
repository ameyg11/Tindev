const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const express = require("express");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // ⭐ Fetch REAL logged-in user from DB (VERY IMPORTANT)
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // ==================================================
      // 1. DAILY LIMIT LOGIC
      // ==================================================
      const SWIPE_LIMIT = 7;

      const today = new Date();
      const lastSwipe = new Date(user.lastSwipeDate || 0);

      const isSameDay = today.toDateString() === lastSwipe.toDateString();

      if (!isSameDay) {
        // Reset swipe count for a new day
        user.dailySwipeCount = 0;
      }

      // Check if user already exceeded limit
      if (user.dailySwipeCount >= SWIPE_LIMIT) {
        return res.status(400).json({
          message: "Daily limit reached! Come back tomorrow for more swipes.",
          isLimitReached: true,
        });
      }
      // ==================================================

      // ==================================================
      // 2. VALIDATE TARGET USER
      // ==================================================
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // prevent sending request twice
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
      }
      // ==================================================

      // ==================================================
      // 3. CREATE NEW REQUEST
      // ==================================================
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      // ==================================================

      // ==================================================
      // 4. UPDATE DAILY SWIPE STATS
      // ==================================================
      user.dailySwipeCount = (user.dailySwipeCount || 0) + 1;
      user.lastSwipeDate = today;
      await user.save();
      // ==================================================

      // SUCCESS
      res.json({
        message: `${user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: "ERROR: " + err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid request status!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data: data });
    } catch (err) {
      res.send("ERROR : " + err);
    }
  }
);

module.exports = requestRouter;
