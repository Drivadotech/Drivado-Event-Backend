const booking = require("../model/booking");
const moment = require("moment");
const { default: ShortUniqueId } = require("short-unique-id");
const vehicle = require("../model/vehicle");
const company = require("../model/company");
const user = require("../model/user");
const passenger = require("../model/passenger");

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

//Jobs For Tommorow
exports.jobsForTomorrow = async (req, res) => {
  try {
    let tomorrow = moment().add(1, "days").format("YYYY-MM-DD");

    const getBooking = await booking.find({
      travelDate: tomorrow,
    });
    res
      .status(201)
      .send({ success: true, message: "booking fetched", data: getBooking });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//Jobs For Today
exports.jobsForToday = async (req, res) => {
  try {
    const getBooking = await booking.find({
      travelDate: new Date().toISOString().slice(0, 10),
    });
    res
      .status(201)
      .send({ success: true, message: "booking fetched", data: getBooking });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// get all booking details
exports.getAllBookingDetails = async (req, res) => {
  const userdetail = await user
    .findOne({ _id: req.user._id })
    .populate("permission")
    .populate("company");

  try {
    let payload = {
      bookingStatus: { $in: ["CONFIRMED", "COMPLETED", "CANCELLED"] },
    };
    console.log(req.query, "query");
    if (req.query.bookingId) {
      payload.bookingId = req.query.bookingId;
    }

    if (req.query.createdDateStart && req.query.createdDateEnd) {
      payload.createdAt = {
        $gte: new Date(req.query.createdDateStart),
        $lte: new Date(req.query.createdDateEnd),
      };
    }

    if (req.query.travelStartDate && req.query.travelEndDate) {
      payload.travelDate = {
        $gte: new Date(req.query.travelStartDate),
        $lte: new Date(req.query.travelEndDate),
      };
    }

    if (req.query.userName) {
      payload.userName = req.query.userName;
    }

    if (req.query.bookingStatus) {
      payload.bookingStatus = req.query.bookingStatus;
    }

    console.log(payload, "payload");
    // let limit = 20;
    if (req.query.createdDateStart && req.query.createdDateEnd) {
      limit = await booking.count();
    } else if (req.query.bookingId) {
      limit = await booking.count();
    } else if (req.query.travelStartDate && req.query.travelEndDate) {
      limit = await booking.count();
    } else if (req.query.bookingStatus) {
      limit = await booking.count();
    } else if (req.query.passengerName) {
      limit = await booking.count();
    } else if (req.query.userName) {
      limit = await booking.count();
    } else if (req.query.companyName) {
      limit = await booking.count();
    } else {
      limit = 10;
    }

    const skip = (req.query.page - 1) * limit;

    if (req.query.companyName) {
      let userNames = [];
      const companyDetails = await company
        .find({
          companyName: req.query.companyName,
        })
        .populate("users");

      const bookings = await booking.find({});

      companyDetails[0]?.users?.forEach((user) => {
        bookings?.forEach((booking) => {
          if (booking?.userName === user?.userName) {
            userNames.push(user?.userName);
            payload = {
              ...payload,
              userName: {
                $in: userNames,
              },
            };
          }
        });
      });
    }

    //  find customer name --> start
    if (req.query.passengerName) {
      let passengerIDs = [];
      const passengers = await passenger.find({});
      passengers.forEach((passenger) => {
        let passengerName = passenger?.firstName + " " + passenger?.lastName;
        if (passengerName.includes(req.query.passengerName)) {
          console.log(passenger, "ppp");
          passengerIDs.push(passenger?._id);
          payload = {
            ...payload,
            passengerDetails: { $in: passengerIDs },
          };
        }
      });
    }

    if (
      userdetail?.role === "USER" &&
      userdetail?.permission?.manageBooking?.viewBooking?.permission ===
        "ENABLE"
    ) {
      payload = {
        ...payload,
        userName: userdetail?.userName,
      };
    }

    if (
      userdetail?.role === "USER" &&
      userdetail?.permission?.manageBooking?.viewBooking?.permission ===
        "ENABLE" &&
      req.query.userName
    ) {
      payload = {
        ...payload,
        userName: "",
      };
    }

    if (
      userdetail?.role === "USER" &&
      userdetail?.permission?.manageBooking?.viewBooking?.permission ===
        "BRANCH_LEVEL"
    ) {
      // extract user name from company
      let userNames = [];
      userdetail?.company?.users.forEach((user) => {
        userNames.push(user?.userName);
      });

      payload = {
        ...payload,
        userName: {
          $in: userNames,
        },
      };

      userNames = [];
    }

    if (
      userdetail?.role === "USER" &&
      userdetail?.permission?.manageBooking?.viewBooking?.permission ===
        "CHILD_COMPANY"
    ) {
      // extract user name from company
      let userNames = [];
      userdetail?.company?.users?.forEach((user) => {
        userNames.push(user?.userName);
      });

      userdetail?.company?.company?.forEach((company) => {
        company?.users?.forEach((user) => {
          userNames.push(user?.userName);
          // remove duplicate
          userNames = [...new Set(userNames)];
        });
      });

      payload = {
        ...payload,
        userName: {
          $in: userNames,
        },
      };

      userNames = [];
    }
    console.log(payload, "payload");
    const allBookingDetails = await booking
      .find(payload)
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1,
      })
      .populate("vehicleDetails")
      .populate("passengerDetails")
      .populate("driverDetails");

    // console.log(allBookingDetails[0], "all Booking details");

    res.status(200).send(allBookingDetails);
  } catch (error) {
    res.send({ err: error });
  }
};

// Driver Status Update

exports.driverStatusUpdate = async (req, res) => {
  try {
    
    const bookingId = req.query.bookingId;

    const findBooking = await booking.findOneAndUpdate({
      bookingId: bookingId,
      driverDetails: req.driver._id,
    },{driverStatus:req.body});

    res.status(201).send({success:true,message:"Driver successfully completed the job",data:findBooking})
  } catch (error) {
    res.send({ err: error });
  }
};
