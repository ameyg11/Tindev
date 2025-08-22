const connectDB = require("./config/database");
const express = require("express");
const app = express();
const User = require("./models/user");

app.use(express.json());

// posting data to database
app.post("/signup", async (req, res) => {
  // console.log(req.body);

  {
    /*const userObj = {
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "viraat@gmail.com",
        password: "98765321"
    }*/
  }

  // Creating a new instance of a User model
  const user = new User(req.body);

  try {
    // throw new Error("1234567")
    console.log(req.body);
    await user.save();
    res.send("new user logged In");
  } catch (err) {
    res.send("there was some error", err);
  }
});

// getting data from database
app.get("/user", async (req, res) => {
  const userMail = req.body.emailID;

  try {
    const user = await User.find({ emailId: userMail });
    res.send(user);
  } catch (err) {
    res.send("Something Went Wrong");
  }
});

app.get("/feed", async (req, res) => {
  // const userMail = req.body.emailID;

  try {
    const user = await User.find({});
    res.send(user);
    // console.log(user)
  } catch (err) {
    res.send("Something Went Wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userID = req.body.userId;

  try {
    await User.findByIdAndDelete(userID);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "age", "skills"];
    const isUpdatedAllowed = Object.keys(data).every((k) => {
        return ALLOWED_UPDATES.includes(k);
    });

    if (!isUpdatedAllowed) {
      throw new Error("Updates of this field are not allowed");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
    console.log(user);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database successfully connected");
    app.listen(7777, () => {
      console.log("Server is running successfully running on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Error occured", err);
  });
