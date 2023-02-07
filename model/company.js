const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { v4: uuidv4 } = require("uuid");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    unique: [true, "company name should be unique"],
    required: [true, "please enter company name"],
    trim: true,
  },
  // unique company id
  companyId: {
    type: String,
    unique: true,
    default: uuidv4(),
  },
  // company email
  email: {
    type: String,
    validate: [validator.isEmail, "please enter email in correct format"],
    trim: true,
    unique: [true, "email is  already been used"],
    
  },
  website: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  //gst/vat
  gst_vat: {
    type: String,
  },
  creditLimit: {
    type: Number,
    default: "0",
  },
  discount: {
    type: Number,
    default: "0",
  },
  markUp: {
    type: Number,
    default: "0",
  },
  totalUnpaidBooking: {
    type: Number,
    default: "0",
  },
  availableLimit: {
    type: Number,
    default: "0",
    minimum: 0,
  },
  invoiceable: {
    type: Boolean,
    default: false,
  },
  root: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: "ENGLISH",
  },
  currency: {
    type: String,
    default: "USD",
  },
  distanceUnit: {
    type: String,
    dafault: "KILOMETERS",
    enum: ["KILOMETERS", "MILES"],
  },
  timeFormat: {
    type: Number,
    dafault: 24,
  },
  nightSearchPrice: {
    type: Number,
  },
  dateFormat: {
    type: String,
    dafault: "DD/MM/YYYY",
  },
  parentCompany: {
    type: ObjectId,
    ref: "Company",
  },
  companyLogo: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  emergencyContactOne: {
    type: String,
  },
  emergencyContactTwo: {
    type: String,
  },
  emergencyContactThree: {
    type: String,
  },
  // users under company
  users: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
  //Driver under company
  driver: [
    {
      type: ObjectId,
      ref: "driver",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("company", companySchema);
