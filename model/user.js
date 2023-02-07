const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "enter the first name"],
      trim: "true",
    },
    lastName: {
      type: String,
      required: [true, "enter the last name"],
      trim: "true",
    },
    userName: {
      type: String,
      required: [true, "enter the userName"],
      trim: "true",
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is mandatory"],
      validate: [validator.isEmail, "please enter email in correct format"],
      trim: true,
      unique: [true, "email is  alraedy been used"],
    },
    mobile: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
      minlength: [8, "password should of min length six character"],
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    userActiveStatus: {
      type: String,
      enum: ["ENABLE", "DISABLE"],
      default: "ENABLE",
    },
    position: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    userLocked: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: "English",
    },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userPermission",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);