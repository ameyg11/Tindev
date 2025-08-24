const connectDB = require("./config/database");
const express = require("express");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");

app.use(express.json());

// posting data to database
app.post("/signup", async (req, res) => {
  // Creating a new instance of a User model
  const user = new User(req.body);

  try {
    // validating user
    validateSignUpData(req);

    // Encrypt passwords

    await user.save();
    res.send("new user logged In");
  } catch (err) {
    res.send("ERROR : " + err);
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

    if (data.skills.length > 10) {
      throw new Error("Skills should be less than 5");
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
