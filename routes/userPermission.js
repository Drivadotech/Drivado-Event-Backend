const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/adminAuth");
const {userPermission,updateUserPermission} = require("../controller/userPermisionController");

router.route("/userPermission").post(auth, authAdmin, userPermission);
router.route("/updatePermission").patch(auth, authAdmin, updateUserPermission);

module.exports = router;
