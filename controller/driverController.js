const DriverModel = require("../model/driver");
const CompanyModel = require("../model/company");
const bcrypt = require("bcrypt");
const mailHelper = require("../utils/emailHelper");
const jwt = require("jsonwebtoken");
const BookingModel = require("../model/booking");
const booking = require("../model/booking");

//creating Refresh Token
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: "10d",
  });
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: "10d",
  });
};

exports.registerDriver = async (req, res) => {
  try {
    const companyId = req.query.companyId;
    // const bookingId =req.query.bookingId

    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      driverLicenseNumber,
      carPlateNumber,
    } = req.body;

    //checking if firstname lastname and username fields are entered or not
    if (!(firstName || lastName)) {
      return res.status(401).send({
        success: true,
        message: "userName firstName and lastName fields are mandatory",
      });

      //checking if email and passsword fields are entered or not
    } else if (!(mobile || password)) {
      return res.status(401).send({
        success: true,
        message: "email and passsword fields are mandatory",
      });
    }

    const DriverDetail = await DriverModel.findOne({ mobile: mobile });

    if (DriverDetail) {
      return res.status(401).send({
        success: false,
        message: "Driver With this mobile number already exists",
      });
    }
    //hashing of password
    const hashPassword = await bcrypt.hash(password, 10);

    const newDriver = {
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      email,
      mobile,
      password: hashPassword,
      driverLicenseNumber,
      carPlateNumber,
    };

    const createDriver = await DriverModel.create(newDriver);

    await DriverModel.findByIdAndUpdate(createDriver._id, {
      companyId: companyId,
    });
    let updateDriverInCompany;
    console.log(companyId);
    if (companyId) {
      updateDriverInCompany = await CompanyModel.findByIdAndUpdate(
        { _id: companyId },
        { $push: { driver: createDriver._id } }
      );
    }

    res.status(200).send({
      success: true,
      message: "Driver created successfully",
      data: updateDriverInCompany,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.driverLogin = async (req, res) => {
  try {
    const { mobile, companyId, password } = req.body;
    if (!(mobile || companyId || password)) {
      return res.send({
        success: false,
        message: "Either mobile, company id  or password is missing",
      });
    }
    const driver = await DriverModel.findOne({ mobile: mobile });

    if (!driver) {
      return res.send({ success: false, message: "driver not found" });
    }

    const checkCompanyId = await DriverModel.findOne({ companyId: companyId });

    if (!checkCompanyId) {
      return res.send({ success: false, message: "Company id did not match" });
    }
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ status: false, message: "Password did not match,try again" });
    }

    const refresh_Token = createRefreshToken({ id: driver._id });

    res.cookie("refreshtoken", refresh_Token, {
      httpOnly: true,
      path: "/api/v1/user/refresh_Token",
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("refreshToken", refresh_Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).send({
      success: true,
      refresh_Token: refresh_Token,
      message: "Login Successful",
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.updatePasswordOfDriverByUser = async (req, res) => {
  try {
    console.log("Driver->", req.driver);
    console.log("user->", req.user);

    const { password } = req.body;
    const driverId = req.query.driverId;

    const checkDriverPresent = await DriverModel.findOne({ _id: driverId });
    if (!checkDriverPresent) {
      return res
        .status(401)
        .send({ success: false, message: "Driver With this id not found" });
    }

    const driverToChange = await DriverModel.findOne({
      _id: driverId,
    });
    if (!driverToChange) {
      return res
        .status(401)
        .send({ success: false, message: "user not present" });
    }
    console.log(driverToChange);

    const hashPassword = await bcrypt.hash(password, 10);

    //update password in database
    const updateDriverPassword = await DriverModel.findByIdAndUpdate(
      req.query.driverId,
      {
        password: hashPassword,
      }
    );

    return res.status(200).send({
      success: true,
      message: "password updated successfully",
      data: updateDriverPassword,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//get user details of a specific user
exports.getDriverInformation = async (req, res) => {
  try {
    const driverInformation = await DriverModel.findById({
      _id: req.driver._id,
    })
      .select("-password")
      .populate("companyId");

    return res.status(200).send({
      success: true,
      message: "driver details found",
      data: driverInformation,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//Get all Driver Details
exports.getAllDriverInformation = async (req, res) => {
  try {
    const driverInformation = await DriverModel.find().select("-password");
    // console.log("user--------->",req.user);

    res.status(200).send({
      success: true,
      message: "all driver details found",
      data: driverInformation,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//Forget Password

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //Check if user is present
    const driver = await DriverModel.findOne({ email: email });
    if (!driver) {
      return res
        .status(401)
        .send({ success: false, message: "driver not present" });
    }

    //Generate access token to attach in the url
    const accessToken = createAccessToken({ id: driver._id });

    const url = `${process.env.CLIENT_URL}/user/resert/${accessToken}`;
    const to = driver.email;
    const from = "techsupport@drivado.com";
    const message = "PLEASE OPEN THE URL TO RESET PASSWORD";
    const template = `<h3>${message} ${url}</h3>`;
    const subject = "Reset Password";

    //Send Mail
    mailHelper(to, from, subject, template, url);

    res.status(200).send({
      sucess: true,
      message: "reset mail has been sent to your email",
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    //update password in database
    console.log(req.driver);
    const updateDriverDetails = await DriverModel.findOneAndUpdate(
      { _id: req.driver._id },
      { password: hashPassword }
    );

    res.status(200).send({
      success: true,
      message: "password updated successfully",
      data: updateDriverDetails,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//Update User
exports.updateDriver = async (req, res) => {
  try {
    const updateDriver = await DriverModel.findOneAndUpdate(
      { _id: req.query.id },
      req.body
    );

    res.status(200).send({
      success: true,
      message: "updated successfully",
      data: updateDriver,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.assignDriver = async (req, res) => {
  try {
    const driverId = req.query.driverId;
    const checkDriver = await DriverModel.findOne({ _id: driverId });
    if (!checkDriver) {
      return res
        .status(401)
        .send({ success: false, message: "driver not found" });
    }
    const updateBooking = await BookingModel.findByIdAndUpdate(
      { _id: req.query.bookingId },
      {
        driverDetails: driverId,
      }
    );
    res.status(201).send({
      success: true,
      message: "Driver Assigned Successfully",
      data: updateBooking,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//Update Driver Status

exports.updateDriverStatus = async (req, res) => {
  try {
    const driverActiveStatus = req.query.driverActiveStatus;
    console.log("----------------->", req.driver);
    const updateDriverStatus = await DriverModel.findByIdAndUpdate(
      { _id: req.driver._id },
      { driverActiveStatus: driverActiveStatus }
    );
    res.status(201).send({
      success: true,
      message: "status updated successfully",
      data: updateDriverStatus,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


//Assign Booking     all bookings
exports.assignedBooking = async (req, res) => {
  try {
    console.log(req.driver);
    const findBookingOfParticualarData = await booking.find({
      driverDetails: req.driver._id,
    });
    console.log(findBookingOfParticualarData);
    return res
      .status(500)
      .send({
        success: false,
        message: "",
        data: findBookingOfParticualarData,
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//Today BOOKING inprogress
exports.getPresentBooking = async (req, res) => {
  try {
    console.log(req.driver);
    // console.log(new Date().toISOString().slice(0, 10));

    const findPresentBooking = await booking.find({
      driverDetails: req.driver._id,
      travelDate: new Date().toISOString().slice(0, 10),
    });
    // console.log(findPresentBooking);

    res.status(201).send({success:true,message:"Booking found",data:findPresentBooking})

  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//PAST BOOKING   
exports.getPastBooking = async (req, res) => {
  try {
    console.log(req.driver);
    const getPastBooking = await booking.find({
      driverDetails: req.driver._id,
      travelDate: { $lt: new Date().toISOString().slice(0, 10) },
    });
    // console.log(getPastBooking);
    res.status(201).send({success:true,message:"Booking found",data:getPastBooking})
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//Future BOOKING   upcoming
exports.getFutureBooking = async (req, res) => {
  try {
    console.log(req.driver);
    const getFutureBooking = await booking.find({
      driverDetails: req.driver._id,
      travelDate: { $gt: new Date().toISOString().slice(0, 10) },
    });
    res.status(201).send({success:true,message:"Booking found",data:getFutureBooking})
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};




