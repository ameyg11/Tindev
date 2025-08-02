const express = require("express");

const app = express();

app.get("/user/:userId",(req,res) => {
    // console.log(req.query);
    console.log(req.params)
    res.send({firstName:"Amey",lastName:"Gawade"})
})

app.post(/a/,(req,res) => {
    res.send("saved data to database")
})

app.get(/^\/ab+c$/,(req,res) => {
    res.send("saved data to database")
})

app.get(/^\/ab?c$/, (req, res) => {
  res.send("Regex ? works!");
});



app.use("/test",(req, res) => {
    res.send("Hello from the server!")
})

app.listen(7777, ()=> {
    console.log("Server is running successfully running on port 7777...");
});