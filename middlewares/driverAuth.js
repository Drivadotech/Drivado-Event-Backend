const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("DriverAuthorization");
    // console.log(token, "<--- checking point of auth");
    if (!token) {
      return res
        .status(400)
        .send({ success: false, message: "token is missing" });
    }
    // const user = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
    // if (!user) {
    //   return res
    //     .status(400)
    //     .send({ sucess: false, message: "Invalid Authentication" });
    // }
    jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN, (err, driver) => {
      console.log(driver);
      console.log(err);
      if (err) {
        return res
          .status(400)
          .send({ sucess: false, message: "Invalid Authentication" });
      }
      req.driver = driver;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = auth;
