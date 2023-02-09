const express = require("express");
const { registerDriver, driverLogin, updatePasswordOfDriverByUser, getDriverInformation, getAllDriverInformation, forgotPassword, resetPassword, assignDriver, updateDriverStatus, getPastBooking, assignBooking } = require("../controller/driverController");
const router = express.Router();
const driverAuth = require("../middlewares/driverAuth");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/adminAuth");


router.route("/registerDriver").post(registerDriver);
router.route("/driverlogin").post(driverLogin);
// router.route("/access_Token").post(getAccessToken);
router.route("/updatePasswordOfDriverByUser").patch(auth,admin,updatePasswordOfDriverByUser);
router.route("/getDriverInformation").get(driverAuth, getDriverInformation);
router.route("/getAllDriverInformation").get( auth,admin,getAllDriverInformation);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(driverAuth, resetPassword);
router.route("/assignDriver").post(auth,admin, assignDriver);
router.route("/updateDriverStatus").patch(driverAuth, updateDriverStatus);
router.route("/assignedBooking").get(driverAuth, assignBooking);
router.route("/getPastBooking").get(driverAuth, getPastBooking);


module.exports = router;