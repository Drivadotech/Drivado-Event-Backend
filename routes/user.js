const express = require("express");
const { registerMail, registerUser, login, getAccessToken, unlockUser, lockUser, forgotPassword, resetPassword } = require("../controller/userController");
const router = express.Router();
const authAdmin = require("../middlewares/adminAuth");
const auth = require("../middlewares/auth");


router.route("/registermail").post(registerMail);
router.route("/registerUser").post(registerUser);
router.route("/login").post(login);
router.route("/access_Token").post(getAccessToken);
router.route("/unlockUser").get(auth, authAdmin, unlockUser);
router.route("/lockUser").get(auth, authAdmin, lockUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(auth, resetPassword);


module.exports = router;