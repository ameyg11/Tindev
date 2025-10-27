require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async() => {
    await 
    mongoose.connect(
        process.env.MONGO
    )};


module.exports = connectDB;