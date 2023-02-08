const express = require("express");
const { registerMail, registerUser, login, getAccessToken, unlockUser, lockUser, forgotPassword, resetPassword, updatePasswordByAdmin, getUserInformation, getAllUserInformation, logOut, updateUser, updateUserRole, updateuserActiveStatus } = require("../controller/userController");
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
router.route("/updatePasswordByAdmin").patch(auth, authAdmin, updatePasswordByAdmin);
router.route("/getUserInformation").get(auth, getUserInformation);
router.route("/getAllUserInformation").get(auth, authAdmin, getAllUserInformation);
router.route("/logout").get(logOut);
router.route("/updateUser").patch(auth, updateUser);
router.route("/updatRole").patch(auth, authAdmin, updateUserRole);
router.route("/updateuserActiveStatus").patch(auth, authAdmin, updateuserActiveStatus);

module.exports = router;