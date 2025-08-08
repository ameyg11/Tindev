const express = require("express");

const app = express();
const  { adminAuth } = require("./middleware/auth");

app.use("/admin", adminAuth);

app.use("/admin/data", (req, res) => {
    res.send("data is fetched")
})

app.use("/users",(req, res, next) => {
    console.log("1st console");
    res.send("hello");
    next();
    },
    (req, res) => {
        console.log("2nd console");
        // res.send("2nd response");
    }
);


app.listen(7777, ()=> {
    console.log("Server is running successfully running on port 7777...");
});