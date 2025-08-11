const express = require("express");
const app = express();

const connectDB = require("./config/database");


connectDB()
    .then(() => {
        console.log("database successfully connected");
        app.listen(7777, ()=> {
            console.log("Server is running successfully running on port 7777...");
        });
    })
    .catch((err) =>{
        console.log("Error occured",err);
    })
