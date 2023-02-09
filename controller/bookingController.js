const booking = require("../model/booking");
const moment = require("moment");
const { default: ShortUniqueId } = require("short-unique-id");
const vehicle = require("../model/vehicle");

exports.createBooking = async (req, res) => {
  try {
    const uid = new ShortUniqueId({ length: 5 });
    const today = moment().format("YYYY-MM-DD");

    const bookingId = `D${today.split("-")[1]}${today
      .split("-")[0]
      .slice(-2)}-${uid().toUpperCase()}`;

    // console.log(bookingId);
    req.body.bookingId = bookingId;

    req.body.passenger = parseInt(req.body.passenger);

    console.log(req.body);

    const bookingDetail = await booking.create(req.body);
    res.status(201).send({
      success: true,
      message: "booking Successfully Done",
      data: bookingDetail,
    });
  } catch (error) {
    res.status(500).send({ success: false, err: error });
  }
};

// get booking details by id
exports.getBookingDetailsById = async (req, res) => {
  try {
    console.log(req.query.id);
    const bookingDetails = await booking
      .find({ bookingId: req.query.id })
      .populate("vehicleDetails")
      .populate("passengerDetails")
      .populate("company")
      .populate("driverDetails");

    res.status(200).send({ bookingDetails: bookingDetails[0] });
  } catch (error) {
    console.log(error);
  }
};

// total booking count
exports.totalBookingCount = async (req, res) => {
  try {
    const totalBookingCount = await booking.count({
      bookingStatus: { $in: ["CONFIRMED", "COMPLETED", "CANCELLED"] },
    });
    res.status(200).send({ totalBookingCount });
  } catch (error) {
    console.log(error);
  }
};

//Booking Status
exports.bookingStatus = async (req, res) => {
  try {
    const updateBookingStatus = await booking.findOneAndUpdate(
      { _id: req.query.bookingId },
      { bookingStatus: req.body.bookingStatus.toUpperCase() }
    );
    res.status(200).send({
      status: true,
      msg: "Booking Status Updated Successfully",
      data: updateBookingStatus,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// get all booking details
exports.getAllBookingDetails = async (req, res) => {
  
};



//Jobs For Tommorow
exports.jobsForTomorrow = async (req, res) => {
  try {
    const getBooking = await booking.find({travelDate:{$gt:new Date().toISOString().slice(0, 10)}})
    res.status(201).send({success:true,message:"booking fetched",data:getBooking})
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//Jobs For Tommorow
exports.jobsForToday = async (req, res) => {
  try {
    const getBooking = await booking.find({travelDate:new Date().toISOString().slice(0, 10)})
    res.status(201).send({success:true,message:"booking fetched",data:getBooking})
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

