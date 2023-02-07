 const express = require("express");
const { registerCompany } = require("../controller/companyController");
const router = express.Router();

router.route("/createCompany").post(registerCompany);



module.exports=router