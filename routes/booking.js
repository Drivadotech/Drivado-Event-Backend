const router = require("express").Router();
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/adminAuth");
const driverAuth = require("../middlewares/driverAuth");
const bookingController = require("../controller/bookingController");

router.route("/createBooking").post(bookingController.createBooking);
// get Each booking details
router.route("/getBookingDetailsById").get(bookingController.getBookingDetailsById);
router.route("/totalBooking").get(auth, bookingController.totalBookingCount);
router.route("/bookingStatus").patch(auth, authAdmin, bookingController.bookingStatus);
router.route("/jobsForToday").get(auth,authAdmin,bookingController.jobsForToday);
router.route("/jobsForTomorrow").get(auth,authAdmin,bookingController.jobsForTomorrow);
router.route("/getAllBooking").get(auth, bookingController.getAllBookingDetails);
router.route("/driverStatusUpdate").patch(driverAuth, bookingController.driverStatusUpdate);
module.exports = router