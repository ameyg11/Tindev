const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("E-mail is not valid: " +value);
      }
    },
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
  photoUrl: {
    type: String,
    default: "https://i.pinimg.com/736x/21/f6/fc/21f6fc4abd29ba736e36e540a787e7da.jpg",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("E-mail is not valid: ",value);
      }
    },
  },
  about: {
    type: String,
    maxLength: 99
  },
  skills: {
    type: [String],
  }
},{timestamps: true});

userSchema.methods.getJWT = async function() {
  const user = this;

  const token = await jwt.sign({_id: user._id}, "tin@dev1110",{
    expiresIn: "30d",
  })

  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const iSPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  )

  return iSPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
