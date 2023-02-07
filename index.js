const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors") 
const morgan = require("morgan")
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser")
const connectWithMongodb = require("./config/db")
const fileUpload = require("express-fileupload");
require("dotenv").config();



// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// connection with mongodb database
connectWithMongodb();

// express app initialized
const app = express()


// basic middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser(process.env.JWT_SECRET_REFRESH_TOKEN));
// logger
app.use(morgan("tiny"));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/",(req,res)=>{
    console.log("connected");
})

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



// import route
app.use("/api/v1/user",require("./routes/user"))
app.use("/api/v1/company", require("./routes/company"));
app.use("/api/v1/driver", require("./routes/driver"));
app.use("/api/v1/vehicles", require("./routes/vehicle"));
app.use("/api/v1/permission", require("./routes/userPermission"));
// app.use("/api/v1/bookings", require("./routes/booking"));
// app.use("/api/v1/passengers", require("./routes/passenger"));