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
    res
      .status(201)
      .send({
        success: true,
        message: "booking Successfully Done",
        data: bookingDetail,
      });
  } catch (error) {
    res.status(500).send({ success: false, err: error });
  }
};
