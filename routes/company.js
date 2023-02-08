 const express = require("express");
const { registerCompany, getAllCompanies, getSingleCompanyDetails, getSingleUserDetails, updateCompanyDetils } = require("../controller/companyController");
const router = express.Router();
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/adminAuth");

router.route("/createCompany").post(registerCompany);
router.route("/getallCompany").get(auth, getAllCompanies);
router.route("/getSingleCompany").get(auth, getSingleCompanyDetails);
router.route("/getSingleUser").get(auth, getSingleUserDetails);
router.route("/updateCompanyDetils").patch(auth, updateCompanyDetils);

// router.route("/getSubCompanyAndUser").get(getSubComapanAndUser);
// router.route("/search").get(search);


module.exports=router