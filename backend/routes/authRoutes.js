const express = require("express");
const { login, register, logout, getUserInfo } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getUser", protect, getUserInfo);   // backendurl+'/api/auth/getUser par request krni hai

module.exports = router;

// esme aur routes missing hai nhi itne hi the phle s hi
// kya type kr rhi hai
