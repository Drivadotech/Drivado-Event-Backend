const mongoose = require("mongoose");
const uuid = require("uuid").v4();

const VehicleSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: true,
  },
  categoryType: {
    type: String,
    required: true,
  },
  vehicleId: {
    type: String,
    required: true,
    default: uuid,
  },
  description: {
    type: String,
  },
  passengerCount: {
    type: Number,
    required: true,
  },
  luggageCount: {
    type: Number,
    required: true,
  },
  vehicleImage: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
