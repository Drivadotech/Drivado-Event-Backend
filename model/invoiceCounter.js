const mongoose = require("mongoose");

const incvoiceCounterSchema = new mongoose.Schema({
  invoiceCount: {
    type: Number,
    default: 0,
  },
  invoiceCode: {
    type: String,
    default: "DIO",
  },
});

module.exports = mongoose.model("invoiceCounter", incvoiceCounterSchema);
