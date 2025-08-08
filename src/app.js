const express = require("express");

const app = express();

app.use("/user", (req, res) => {
    // throw new Error("asdfg");
    // res.send("this is user");
    try {
        throw new Error("asdfg");
        res.send("this is user");
    }catch(err){
        res.status(500).send("something went wrong try again")
    }
})

// app.use("/", (err, req, res, next) => {
//     if(err){
//         res.status(404).send("contact admin support")
//     }
// })

app.listen(7777, ()=> {
    console.log("Server is running successfully running on port 7777...");
});