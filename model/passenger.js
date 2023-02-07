const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: String,
    default: null,
  },
  trainNumber: {
    type: String,
    default: null,
  },
  referenceNumber: {
    type: String,
    default: null,
  },
  specialRequest: {
    type: String,
    default: null,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Passenger", PassengerSchema);
