const CompanyModel = require("../model/company");
const UserModel = require("../model/user");



exports.registerCompany = async (req, res) => {
    try {
        const companyName  = req.body.companyName;

    if (!companyName) {
      console.log("Company Name is mandatory");
      return res.send({ success: false, message: "Company Name is mandatory" });
    }
    const companyDetail = await CompanyModel.findOne({
      companyName: companyName,
    });

    if (companyDetail) {
      return res.send({
        success: false,
        message: "Company with Name already exists",
      });
    }
    console.log(req.body);
  const createCompany = await CompanyModel.create(req.body)
  console.log(createCompany);

  
  return res.status(200).send({
    success: true,
    message: "company created successfully",
    data:createCompany
  });

    } catch (error) {
        return res.status(500).send({ success: false, message: error });
    }

}

exports.getAllCompanies = async (req, res) => {
  try {
    const companyDetails = await CompanyModel.find()
      .populate("users")
      .populate("driver");

    if (!companyDetails) {
      return res
        .status(401)
        .send({ success: false, message: "Company Detail not found" });
    }
    return res.status(200).send({ success: true, data: companyDetails });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


//get company details
exports.getSingleCompanyDetails = async (req, res) => {
  try {
    const singleCompanyDetails = await CompanyModel.find({
      _id: req.query.id,
    }).populate("users").populate("driver")

    if (!singleCompanyDetails) {
      res.send("No such company registered");
    }
  
    res.send({ singleCompanyDetails });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
}


// get single user details
exports.getSingleUserDetails = async (req, res) => {
  try {
    const singleUserDetails = await UserModel.findById(req.query.userid)
      .populate("permission")
      .populate("company");

    if (!singleUserDetails) {
      res.send("No such user registered");
    }

    res.send({ singleUserDetails });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// Update company Detail
exports.updateCompanyDetils = async (req, res) => {
  try {
    const companyDetail = await CompanyModel.findById(req.query.id);

    console.log(companyDetail, "<-- company detail");
    let companyLogoImageFile;
    // console.log(req.body, "<----- req.body");

    if (req.files) {
      // console.log(req.files, "<-- req.files");
      if (companyDetail?.companyLogo?.id) {
        console.log("calling destroy");
        await cloudinary.v2.uploader.destroy(companyDetail?.companyLogo?.id);
      }

      companyLogoImageFile = await cloudinary.v2.uploader.upload(
        req.files.companyLogo.tempFilePath,
        {
          folder: "companylogo",
        }
      );
    }

    const companyLogo = companyLogoImageFile && {
      id: companyLogoImageFile?.public_id,
      secure_url: companyLogoImageFile?.secure_url,
    };

    req.body.companyLogo = companyLogo ? companyLogo : null;

    const updatedetails = await CompanyModel.findOneAndUpdate(
      { _id: req.query.id },
      req.body
    );

    return res.status(200).send({
      success: true,
      message: "company details updated successfully",
      data: updatedetails,
    });

  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }

}
