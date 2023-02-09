const Vehicle = require("../model/vehicle");
const VehicleCategory = require("../model/vehicleCatagory");
const User = require("../model/user");
const cloudinary = require("cloudinary");



let allVehicles = [];

// Create Vehicle Catagory

exports.addCategory = async (req, res) => {
  try {
    const categoryDetail = await VehicleCategory.findOne({
      name: req.body.name,
    });
    if (categoryDetail) {
      res.send({ errmsg: "Category already exist" });
    }
    const Category = await VehicleCategory.create(req.body);

    res.status(200).send(Category);
  } catch (err) {
    res.status(500).send(err);
  }
};

//Create Vehicle
exports.createVehicle = async (req, res) => {
  try {
    let vehicleImageFile;
    if (!req.files) {
      res.send({ success: false, message: "file not found" });
    } else {
      if (req.files.vehicleImage) {
        console.log(req.files.vehicleImage.tempFilePath, "<--------files");

        vehicleImageFile = await cloudinary.v2.uploader.upload(
          req.files.vehicleImage.tempFilePath,
          { folder: "vehicleImages" }
        );
      }
    }

    const vehicleImage = vehicleImageFile && {
      id: vehicleImageFile.public_id,
      secure_url: vehicleImageFile.secure_url,
    };

    req.body.vehicleImage = vehicleImage ? vehicleImage : null;

    // console.log(req.body);

    const vehicle = await Vehicle.create(req.body);

    // console.log(vehicle);

    const vehicleCategoryDetail = await VehicleCategory.findOne({
      name: req.body.categoryType,
    });
    // console.log(vehicle._id)
    vehicleCategoryDetail.vehicles.push(vehicle._id);

    // console.log(vehicleCategoryDetail);

    res.status(201).send({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Get All Vehicle Catagoty
exports.getCategory = async (req, res) => {
  try {
    const categoryDetails = await VehicleCategory.find().populate("vehicles");

    res.status(200).send(categoryDetails);
  } catch (err) {
    res.status(500).send(err);
  }
};


// GET ALL VEHICLE
 exports.showVehicles = async(req,res)=>{
  try {
    const vehicles = await Vehicle.find();
    res.status(200).send(vehicles);
    // console.log(vehicles);
    vehicles.forEach((vehicle)=>{
      // console.log("vehicle-------->",vehicle);
      allVehicles.push(vehicle)    
    })
  } catch (error) {
    res.status(500).send(err);
  }
 }


//  UPDATE VEHICLE
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.query.vehicleId);
    if (!vehicle) {
      return res.status(404).send("Vehicle not found");
    }
    let vehicleImageFile;
    // console.log(req.body);
    
    if (req.files) {
      if (req.files.vehicleImage) {
        if (vehicle.vehicleImage) {
          await cloudinary.v2.uploader.destroy(vehicle.vehicleImage.id);
        }

        console.log(req.files.vehicleImage.tempFilePath, "<----- file");
        vehicleImageFile = await cloudinary.v2.uploader.upload(
          req.files.vehicleImage.tempFilePath,
          { folder: "vehicleImages" }
        );
      }
      const vehicleImage = vehicleImageFile && {
        id: vehicleImageFile.public_id,
        secure_url: vehicleImageFile.secure_url,
      };

      req.body.vehicleImage = vehicleImage ? vehicleImage : null;
    }
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.query.vehicleId,
      req.body,
      { new: true }
    );
    res.status(200).send(updatedVehicle);

  } catch (error) {
     
  }
}
