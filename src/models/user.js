const mongoose = require("mongoose");
const validator = require("validator");

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
    default: "https://www.bing.com/images/search?view=detailV2&ccid=nbiEEr9f&id=DDEFE2E72C3C50B8681DD1457480F4BA1725E888&thid=OIP.nbiEEr9fr4P-UslubiE1RQHaHa&mediaurl=https%3a%2f%2fstatic.vecteezy.com%2fsystem%2fresources%2fpreviews%2f024%2f983%2f914%2fnon_2x%2fsimple-user-default-icon-free-png.png&exph=980&expw=980&q=default+user+image&FORM=IRPRST&ck=41DB74037B011D0FD96E1EA6B86C71F7&selectedIndex=1&itb=1",
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

const User = mongoose.model("User", userSchema);

module.exports = User;
