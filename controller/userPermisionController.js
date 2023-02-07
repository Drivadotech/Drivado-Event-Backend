const UserPermissionModel = require("../model/userPermission");

exports.userPermission = async (req, res) => {
  try {
    const userId = req.query.id;

    const {
      newBooking,
      performSearch,
      MakeBooking,
      manageBooking,
      viewBooking,
      cancelBooking,
      assignAffiliate,
      assignDriver,
      markAsPaid,
      sms_Document,
      affiliate,
      regions,
      generalSettings,
      vehicleTypes,
      imageUploader,
      apiDocs,
      userManagement,
      view,
      edit,
      addUsers,
    } = req.body;

    await UserPermissionModel.findOneAndUpdate(
      { user: userId },
      {
        //NEW BOOKING PERMISSIONS
        "newBooking.permission": newBooking,
        "newBooking.performSearch.permission": performSearch,
        "newBooking.MakeBooking.permission": MakeBooking,

        //MANAGE BOOKING PERMISSIONS
        "manageBooking.permission": manageBooking,
        "manageBooking.viewBooking.permission": viewBooking,
        "manageBooking.cancelBooking.permission": cancelBooking,
        "manageBooking.assignDriver.permission": assignDriver,
        "manageBooking.assignAffiliate.permission": assignAffiliate,
        "manageBooking.markAsPaid.permission": markAsPaid,
        "manageBooking.sms_Document.permission": sms_Document,

        //AFFILIATE PERMISSIONS
        "affiliate.permission": affiliate,

        //REGIONS PERMISSIONS
        "regions.permission": regions,

        //GENERAL SETTINGS PERMISSIONS
        "generalSettings.permission": generalSettings,

        //USER MANAGEMENT PERMISSIONS
        "userManagement.permission": userManagement,
        "userManagement.view.permission": view,
        "userManagement.edit.permission": edit,
        "userManagement.addUsers.permission": addUsers,

        //VEHICLE TYPE PERMISSION
        "vehicleTypes.permission": vehicleTypes,

        //IMAGE UPLOADER PERMISSION
        "imageUploader.permission": imageUploader,

        //API DOCS PERMISSION
        "apiDocs.permission": apiDocs,
      }
    );

    //   const check = await UserPermissionModel.findOne({ user: userId });
    //   console.log(check["newBooking"]["performSearch"]["permission"]);

    return res.send({ message: "Changed Sucessfully" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateUserPermission = async (req, res) => {
  try {
    const userPermissionDetail = await UserPermissionModel.findOne({
      user: req.query.userId,
    });
    if (!userPermissionDetail) {
      return res
        .status(404)
        .send({ success: false, message: "User Permission not found" });
    }

    await UserPermissionModel.findOneAndUpdate(
      { user: req.query.userId },
      req.body
    );

    return res.send({
      success: true,
      message: "User Permission updated successfully",
    });
  } catch (err) {
    res.send(err);
  }
};
