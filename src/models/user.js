const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 45
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true

  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value) {
        if(!["male", "female", "others"].includes(value)){
            throw new Error("Gender data is not valid")
        }
    }
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
