const express = require("express");
const { registerDriver, driverLogin } = require("../controller/driverController");
const router = express.Router();



router.route("/registerDriver").post(registerDriver);
router.route("/driverlogin").post(driverLogin);
// router.route("/access_Token").post(getAccessToken);


module.exports = router;