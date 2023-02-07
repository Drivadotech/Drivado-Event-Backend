const CompanyModel = require("../model/company");



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

