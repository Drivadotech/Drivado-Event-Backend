const passenger = require("../model/passenger");
const booking = require("../model/booking");
const invoiceCount = require("../model/invoiceCounter");

exports.passengerCreate = async (req, res) => {
  try {
    console.log(req.body);
    // const payload = {
    //   firstName: req.body.firstname,
    //   lastName: req.body.lastname,
    //   email: req.body.email,
    //   phone: req.body.phone,
    //   country: req.body.country,
    //   code: req.body.dial_code,
    //   flightNumber: req.body.flightOrTrain,
    //   // trainNumber: req.body.trainNumber,
    //   referenceNumber: req.body.reference,
    //   specialRequest: req.body.specialRequest,
    // };

    const passengerDetail = await passenger.create(req.body);

    const bookingDetails = await booking.findOne({
      bookingId: req.query.bookingId,
    });
    if(!bookingDetails){
      return res.status(401).send({success:false,message:"Booking Not Found"})
    }
    console.log(bookingDetails);

    // const invoiceCodeNum = await invoiceCount.findOneAndUpdate(
    //   { invoiceCode: "DIO" },
    //   { $inc: { invoiceCount: 1 } }
    // );

    const updatedBooking = await booking.findByIdAndUpdate(bookingDetails._id, {
      passengerDetails: passengerDetail._id,
      // invoice_code_num:
      //   invoiceCodeNum.invoiceCode + "-" + invoiceCodeNum.invoiceCount,
    });

    res.status(200).send({ passengerDetail, updatedBooking });
  } catch (error) {
    console.log(error);
  }
};

exports.passegerUpdate = async (req, res) => {
  try {
      console.log(req.body, "passenger update");

    const passengerDetail = await passenger.findByIdAndUpdate(
      req.query.passengerId,
      req.body,
      { new: true, runValidators: true }
    );

    console.log(passengerDetail, "passenger detail");
    res.status(200).send({ passengerDetail });
  } catch (error) {
    console.log(error);
  }
};
