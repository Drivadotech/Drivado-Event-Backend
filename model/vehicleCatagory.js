const mongoose = require("mongoose");

const VehicleCategorySchema = new mongoose.Schema({
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  ],
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("VehicleCategory", VehicleCategorySchema);
