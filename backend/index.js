require("dotenv").config();
const express = require("express");
const connectDB = require("./config/mongodb.js");
const app = express();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const adminFileRoutes = require("./routes/adminFileRoutes.js"); // routes nhi kra kya
const uploadRoutes = require("./routes/uploadRoutes.js");
const dashboardRoutes = require('./routes/dashboardRoutes.js')
const superAdminRoutes = require("./routes/superAdminRoutes.js");
const settingRoutes = require("./routes/settingsRoutes.js");
const superadminFileRoutes = require("./routes/superAdminFileRoutes.js")

// gridfsBucket helper
const { initGridFSBucket } = require("./utils/gridfsBucket.js");

// CORS SETUP
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }

// connectDB returns after mongoose is connected
connectDB()
  .then(() => {
    initGridFSBucket(app); // must run after mongoose.connect resolves

    app.use("/api/auth", authRoutes); // Auth Middleware
    app.use("/api/admin", adminRoutes); // Middleware for admin routes
    app.use("/api/admin/files", adminFileRoutes); // Middleware for admin routes
    app.use("/api/upload", uploadRoutes); // Middleware for file upload routes
    app.use("/api/dashboard", dashboardRoutes); // Middleware for Dashboard routes
    app.use("/api/superadmin", superAdminRoutes); // Middleware for superadmin routes
    app.use("/api/superadmin/files", superadminFileRoutes); // Middleware for admin routes
    app.use("/api/settings", settingRoutes); // Middleware for settings routes


    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Startup failure:", err);
    process.exit(1);
  });

// require("dotenv").config();
// const express = require("express");
// const connectDB = require("./config/mongodb");
// const authRouter = require("./routes/authRoutes");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const adminRoutes = require("./routes/adminRoutes");
// const uploadRoutes = require("./routes/uploadRoutes");

// // gridfsBucket helper
// const { initGridFSBucket } = require("./utils/gridfsBucket.js");

// const app = express();
// const port = process.env.PORT || 8080;
// // connectDB();

// // const allowedOrigins =['http://localhost:5174']

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// ); //yh frontend s lene k liye

// app.use(express.json());
// app.use(cookieParser());
// // app.use(cors({ credentials: true }));  //yh backend k liye

// //API endpoints
// app.get("/", (req, res) => res.send("API working"));

// // connectDB returns after mongoose is connected
// connectDB()
//   .then(() => {
//     initGridFSBucket(app); // must run after mongoose.connect resolves
//     //middleware for fule upload routes
//     app.use("/api/upload", uploadRoutes);
//     app.use("/api/auth", authRouter);

//     // ADMIN MIDDLEWARE
//     app.use("/api/admin", adminRoutes);
//     const PORT = process.env.PORT || 8080;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Startup failure:", err);
//     process.exit(1);
//   });

// toh sbhi request ke liye path same rhaga ye toh : http://localhost:8080/api/auth (badlega toh /register or /login ) esliye esko ek vairable bna lenge aur bar bar usko use krte rhega

//mongodb-atlas password
//appexcel123  --password
//excel     --username

//Bhawana    bhaw123     bhawana11@gmail.com
//Bholu      bholu123    bholu19@gmail.com
