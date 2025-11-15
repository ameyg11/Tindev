const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");
const { verify } = require("jsonwebtoken");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    // Save it in my database
    console.log(order);

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // Return back my order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// dont add userAuth here bcz razor pay is calling you and it is obisiously not logged in
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {

    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SIGNATURE
    );

    if(!isWebhookValid){
      return res.status(400).json({ msg: "Webhook signature is Invalid"})
    }

    // update my payment Status in DB


    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id }); 

    // Update the user as premium

    payment.status = paymentDetails.status;
  
    await payment.save();

    const user = await User.findOne({_id: payment.userId});
    user.isPremium = true;
    user.membershipType  = payment.notes.membershipType;
    await user.save();

    // if(req.body.event == "payment.captured"){

    // }
    // if(req.body.event == "payment.failed"){

    // }

     // return success response to razorpay 

    return res.status(200).json({ msg: "Webhook received successfully" })
  } catch (err) {   
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/premium/verify", userAuth, async(req, res) => {
  const user = req.user;
  if(user.isPremium){
    return res.json({ isPremium: true });
  }

  return res.json({ isPremium: false });
})

module.exports = paymentRouter;
