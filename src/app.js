const express = require("express");
const app = express();
const User = require("./models/user")

const connectDB = require("./config/database");

app.use(express.json())

app.post("/signup", async (req, res) => {
    console.log(req.body);
    
    {/*const userObj = {
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "viraat@gmail.com",
        password: "98765321"
    }*/}

    // Creating a new instance of a User model
    const user = new User(req.body);

    try {
        // throw new Error("1234567")
        await user.save();
        res.send("new user logged In")
    }catch(err) {
        res.send("there was some error")
    }

})

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
