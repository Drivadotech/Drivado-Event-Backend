const router = require("express").Router();

const vehicleController = require("../controller/vehicleController");
const authAdmin = require("../middlewares/adminAuth");
const auth = require("../middlewares/auth");

router.route("/addCategory").post(auth, authAdmin, vehicleController.addCategory);
router.route("/createVehicle").post(vehicleController.createVehicle);
router.route("/showCategory").get(auth, authAdmin, vehicleController.getCategory);
router.route("/showVehicles").get(vehicleController.showVehicles);
router.route("/updateVehicle").patch(vehicleController.updateVehicle);


module.exports = router;