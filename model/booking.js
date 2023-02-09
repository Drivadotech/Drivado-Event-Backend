const mongoose = require("mongoose");
// const moment= require('moment') 

// const { default: ShortUniqueId } = require("short-unique-id");
// const uid = new ShortUniqueId({ length: 5 });
// const today = moment().format("YYYY-MM-DD");

// const bookingId = `D${today.split("-")[1]}${today
//   .split("-")[0]
//   .slice(-2)}-${uid().toUpperCase()}`;

const BookingSchema = new mongoose.Schema({
  source: {
    placename: {
      type: String,
    },
    placeid: {
      type: String,
    },
    lat: {
      type: String,
    },
    lng: {
      type: String,
    },
  },
  destination: {
    placename: {
      type: String,
    },
    placeid: {
      type: String,
    },
    lat: {
      type: String,
    },
    lng: {
      type: String,
    },
  },
  travelDate: {
    type: Date,
  },
  travelTime: {
    type: String,
  },
  duration: {
    type: String,
  },
  travelTimeStamp: {
    type: Date,
  },
  duration: {
    type: String,
  },
  passenger: {
    type: Number,
  },
  bookingType: {
    type: String,
    enum: ["ONEWAY", "HOURLY"],
  },
  bookingId: {
    type: String,
    required: true,
    unique: [true, "Booking Id already exists"],
    // default:bookingId
  },
  travelDistance: {
    type: Number,
  },
  // purchasePrice: {
  //   type: String,
  // },
  // purchaseCurrency: {
  //   type: String,
  // },

  // priceDetails: {
  //   amount: {
  //     type: Number,
  //   },
  //   currency: {
  //     type: String,
  //   },
  //   convertedAmountWithCurrency: {
  //     type: Object,
  //   },
  // },
  timeZone: {
    type: String,
  },
  receivable_note: {
    type: String,
  },
  userName: {
    type: String,
    default: "b2c",
  },
  cancellationFee: {
    type: String,
    default: "0",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  passengerDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Passenger",
  },
 
  driverDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  vehicleDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
  bookingStatus: {
    type: String,
    enum: ["COMPLETED", "CONFIRMED", "CANCELLED"],
  },
 
  remarks: {
    type: String,
  },
  flightDetails: {
    flightNumber: {
      type: Number,
    },
  },


  isSearch: {
    type: Boolean,
    default: false,
  },
  invoice: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  creditCards: {
    type: Array,
  },
  invoice_code_num: {
    type: String,
  },
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingHistory",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);