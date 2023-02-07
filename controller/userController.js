const UserModel = require("../model/user");
const CompanyModel = require("../model/company")
const UserPermission = require("../model/userPermission");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const mailHelper = require("../utils/emailHelper");
const sgMail = require("@sendgrid/mail");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//creating Refresh Token
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: "10d",
  });
};
//Creating Access Token
exports.createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: "10d",
  });
};

//send user detail into an email

exports.registerMail = async (req, res) => {
  try {
    const { firstName, lastName, email, companyName, contactNumber, address } =
      req.body;

    const registerUserMailTemplate = fs.readFileSync(
      path.join(__dirname, "../template/signup.hbs"),
      "utf8"
    );

    const template = handlebars.compile(registerUserMailTemplate);

    const messageBody = template({
      firstName,
      lastName,
      email,
      companyName,
      contactNumber,
      address,
    });

    const msg = {
      to: "techsupport@drivado.com",
      // to: "abhishek@drivado.com",
      from: "support@drivado.com", // Use the email address or domain you verified above
      subject: "New User Registration",
      text: "User Registration details",
      html: messageBody,
    };

    await sgMail.send(msg);

    res.status(200).send({ success: true, message: "mail sent" });
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    //requestin the following fields in the body
    const { userName, firstName, lastName, email, password, mobile } = req.body;

    if (!(userName || firstName || lastName)) {
      return res.status(401).send({
        success: true,
        message: "userName firstName and lastName fields are mandatory",
      });

      //checking if email and passsword fields are entered or not
    } else if (!(email || password)) {
      return res.status(401).send({
        success: true,
        message: "email and passsword fields are mandatory",
      });
    }

    // check if the user exist or not
    const user = await UserModel.findOne({ email: email, userName: userName });
    if (user) {
      return res.status(400).send({
        success: false,
        message: "user with this email or username already exists",
      });
    }

    //hashing of password

    const hashPassword = await bcrypt.hash(password, 10);

    //saving the hashed password in a new variable
    const newUser = {
      userName,
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      email,
      mobile,
      password: hashPassword,
    };

    const createUser = await UserModel.create(newUser);

    const userPermission = await UserPermission.create({
      user: createUser._id,
    });

    await UserModel.findByIdAndUpdate(createUser._id, {
      permission: userPermission?._id,
    });

    const updateChildUser = await CompanyModel.findOneAndUpdate(
      { _id: req.query.parentCompanyid},
      { $push: { users: createUser._id } }
    );

    return res.status(200).send({ success: true, data: updateChildUser });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    //requesting user credential in body
    const { email, password } = req.body;

    if (!(email || password)) {
      return res.send({
        success: false,
        message: "Email or password is missing",
      });
    }

    //check if user exist or not
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.send({ success: false, message: "Email doesn't exist" });
    }

    //to check if user is locked
    if (user.userLocked == true) {
      return res.send({
        success: false,
        message: "Account is locked! Please Contact Admin",
      });
    }

    //login attempt greater than 5 user will be locked
    else if (user.loginAttempts >= 3) {
      await UserModel.updateOne({ email: email }, { userLocked: true });

      //Mail will be sent for password lock
      const to = user.email;
      const from = "techsupport@drivado.com";
      const message =
        "Account locked due to multiple invalid login attempts! Please Contact Admin";
      const template = `<h1>${message}</h1>`;
      const subject = "Account locked due to invalid login attempt";

      mailHelper(to, from, subject, template);

      return res.send({
        success: false,
        message:
          "Account locked due to multiple invalid login attempts! Please Contact Admin",
      });
    }
    //to check is user is Disabled
    else if (user.userActiveStatus == "DISABLE") {
      return res.send({
        success: false,
        message: "Your account has been blocked! Please contact Admin",
      });
    }

    //to check if the password matches or not
    const isMatch = await bcrypt.compare(password, user.password);

    //if not matches
    if (!isMatch) {
      await UserModel.findOneAndUpdate(
        { email: email },
        { loginAttempts: (user.loginAttempts += 1) }
      );
      return res.send({
        success: false,
        message: "Password didn't match, try again",
      });
    } else {
      await UserModel.findOneAndUpdate({ email: email }, { loginAttempts: 0 });
      const refresh_Token = createRefreshToken({ id: user._id });
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
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};



exports.getAccessToken = async (req, res) => {
  try {
    const rf_token = req.cookies.refreshToken;
    console.log(rf_token,"<------------ refresh token");

    if (!rf_token) {
      return res.send({ success: false, message: "Please login again" });
    }

    const logInUser = jwt.verify(
      rf_token,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );

    if (!logInUser) {
      return res
        .status(400)
        .send({ success: false, message: "Please login again" });
    }

    const access_Token = this.createAccessToken({ _id: logInUser.id });

    res.status(200).send({ success: true, accessToken: access_Token });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


//Unlock user if the user is locked
exports.unlockUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.query.userId });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "User not present" });
    }
    await UserModel.findOneAndUpdate(
      { _id: req.query.userId },
      { loginAttempts: 0, userLocked: false }
    );
    res.status(200).send({ status: true, message: "user unlocked" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


exports.lockUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.query.userId });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "User not present" });
    }
    await UserModel.findOneAndUpdate(
      { _id: req.query.userId },
      { loginAttempts: 0, userLocked: true }
    );
    res.status(200).send({ status: true, message: "user locked" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


//Forget Password

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //Check if user is present
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "user not present" });
    }

    //Generate access token to attach in the url
    const accessToken = createAccessToken({ id: user._id });

    const url = `${process.env.CLIENT_URL}/user/resert/${accessToken}`;
    const to = user.email;
    const from = "techsupport@drivado.com";
    const message = "PLEASE OPEN THE URL TO RESET PASSWORD";
    const template = `<h3>${message} ${url}</h3>`;
    const subject = "Reset Password";

    //Send Mail
    mailHelper(to, from, subject, template, url);

    res.status(200).send({
      sucess: true,
      message: "reset mail has been sent to your email",
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    //update password in database
    console.log(req.user);
    const updateUserDetails = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { password: hashPassword }
    );

    res.status(200).send({
      success: true,
      message: "password updated successfully",
      data: updateUserDetails,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.updatePasswordByAdmin = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    // console.log(user);

    const { password } = req.body;

    const userToChange = await UserModel.findOne({ _id: req.query.userId });
    if (!userToChange) {
      return res
        .status(401)
        .send({ success: false, message: "user not present" });
    }
    console.log(userToChange);

    const hashPassword = await bcrypt.hash(password, 10);

    // console.log(hashPassword);

    //update password in database
    const updateUserDetail = await UserModel.findByIdAndUpdate(
      req.query.userId,
      {
        password: hashPassword,
      }
    );

    return res.status(200).send({
      success: true,
      message: "password updated successfully",
      data: updateUserDetail,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};


