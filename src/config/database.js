require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async() => {
    await 
    mongoose.connect(
        "mongodb+srv://ameyg11:vJ4RlF1HCIJWj0fT@namastedev.vj7ydmu.mongodb.net/?retryWrites=true&w=majority&appName=NamasteDev/devTinder"
    )};


module.exports = connectDB;