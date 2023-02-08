const Booking = require("../model/booking")


exports.createBooking = async (req,res)=>{
    const bookingDetail = await Booking.create(req.body)
}

