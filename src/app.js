const express = require("express");

const app = express();

app.use("/hello",(req, res) => {
    res.send("Hello hello no hello!")
})


app.use("/test",(req, res) => {
    res.send("Hello from the server!")
})

app.listen(7777, ()=> {
    console.log("Server is running successfully running on port 3000...");
});