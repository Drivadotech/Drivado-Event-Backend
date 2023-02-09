const router = require("express").Router();
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/adminAuth");
const bookingController = require("../controller/bookingController");

router.route("/createBooking").post(bookingController.createBooking);
// get Each booking details
router.route("/getBookingDetailsById").get(bookingController.getBookingDetailsById);
router.route("/totalBooking").get(auth, bookingController.totalBookingCount);
router.route("/bookingStatus").patch(auth, authAdmin, bookingController.bookingStatus);
router.route("/jobsForToday").get(auth,authAdmin,bookingController.jobsForToday);
router.route("/jobsForTomorrow").get(auth,authAdmin,bookingController.jobsForTomorrow);
module.exports = router