const mongoose = require('mongoose')
const validator = require("validator");
const ObjectId = mongoose.Schema.Types.ObjectId;

const driverSchema = new mongoose.Schema({
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
        mobile: {
        type: String,
        default: "",
        required:[true,"Enter The Mobile Number"]
      },
        email: {
        type: String,
        validate: [validator.isEmail, "please enter email in correct format"],
        trim: true,
        unique: [true, "email is  alraedy been used"],
      },
        password: {
        type: String,
        required: [true, "please enter your password"],
        minlength: [8, "password should of min length six character"],
      },
        carPlateNumber: {
        type: String,
      },
        driverLicenseNumber: {
        type: String,
      },
        driverActiveStatus: {
        type: String,
        enum: ["ENABLE", "DISABLE"],
        default: "ENABLE",
      },
        loginAttempts: {
        type: Number,
        default: 0,
        max: 5,
      },
        driverLocked: {
        type: Boolean,
        default: false,
      },
        language: {
        type: String,
        default: "English",
      },
      companyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
      }
      

})


module.exports = mongoose.model("driver", driverSchema);