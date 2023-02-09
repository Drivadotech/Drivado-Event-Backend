const router = require("express").Router();

const passengerController = require("../controller/passengerController");
const authAdmin = require("../middlewares/adminAuth");
const auth = require("../middlewares/auth");

router.post("/passengerCreateAndBooking", passengerController.passengerCreate);

router.route("/passengerUpdate").patch(auth, authAdmin, passengerController.passegerUpdate);


module.exports = router;
