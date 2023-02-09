const router = require("express").Router();
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/adminAuth");
const { createBooking } = require("../controller/bookingController");

router.route("/createBooking").post(createBooking);

module.exports = router