const DriverModel = require("../model/driver")
const CompanyModel = require("../model/company")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//creating Refresh Token
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: "10d",
    });
  };

exports.registerDriver = async(req,res)=>{
try {     
    const companyId = req.query.companyId  

     const {firstName,lastName,email,mobile,password,driverLicenseNumber,carPlateNumber}=req.body

      //checking if firstname lastname and username fields are entered or not
    if (!(firstName || lastName)) {
        return res.status(401).send({
          success: true,
          message: "userName firstName and lastName fields are mandatory",
        });
  
        //checking if email and passsword fields are entered or not
      } else if (!(mobile || password)) {
        return res.status(401).send({
          success: true,
          message: "email and passsword fields are mandatory",
        });
      }  

    const DriverDetail = await DriverModel.findOne({mobile:mobile})

    if(DriverDetail){
        return res.status(401).send({success:false , message:"Driver With this mobile number already exists"})
    }
     //hashing of password
    const hashPassword = await bcrypt.hash(password, 10);

    const newDriver = {
        firstName: firstName.toUpperCase(),
        lastName: lastName.toUpperCase(),
        email,
        mobile,
        password: hashPassword,
        driverLicenseNumber,
        carPlateNumber
      };

    const createDriver = await DriverModel.create(newDriver)
    
    await DriverModel.findByIdAndUpdate(createDriver._id,{companyId:companyId})
    let updateDriverInCompany;
    console.log(companyId);
    if(companyId){
        updateDriverInCompany = await CompanyModel.findByIdAndUpdate({_id:companyId},{$push:{driver:createDriver._id}})
    }

    res.status(200).send({
        success: true,
        message: "Driver created successfully",
        data: updateDriverInCompany,
      });

} catch (error) {
    return res.status(500).send({ success: false, message: error.message });
}
}


exports.driverLogin = async(req,res)=>{
    try {
        const { mobile, companyId, password } = req.body;
        if (!(mobile || companyId || password)) {
            return res.send({
              success: false,
              message: "Either mobile, company id  or password is missing",
            });
          }
          const driver = await DriverModel.findOne({ mobile: mobile });

          if (!driver) {
            return res.send({ success: false, message: "driver not found" });
          }

          const checkCompanyId = await DriverModel.findOne({companyId:companyId})

        if(!checkCompanyId){
            return res.send({ success: false, message: "Company id did not match" });
        }
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res
              .status(401)
              .send({ status: false, message: "Password did not match,try again" });
          }
          
          const refresh_Token = createRefreshToken({id:driver._id})

         res.cookie("refreshtoken", refresh_Token, {
        httpOnly: true,
        path: "/api/v1/user/refresh_Token",
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("refreshToken", refresh_Token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days
      });
          return res.status(200).send({
            success: true,
            refresh_Token: refresh_Token,
            message: "Login Successful",
          });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
}


