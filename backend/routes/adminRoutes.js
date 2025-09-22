const express = require('express');
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {isAdmin}  = require("../middleware/roleMiddleware");
const { getAllUsers, getUserDetails, deleteUser, toggleBlockUser, getSummaryStats, checkAdminStatus, createUser, updateUser } = require("../controllers/adminController");

// All these routes are protected and admin-only
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/user/:id", protect, isAdmin, getUserDetails);
router.delete("/user/:id", protect, isAdmin, deleteUser);
router.patch("/user/:id/block", protect, isAdmin, toggleBlockUser);
router.get("/summary", protect, isAdmin, getSummaryStats);
router.get("/status/:id", checkAdminStatus);

// Create a new user (role = "user" only)
router.post("/user", protect, isAdmin, createUser);

// Update existing user details
router.put("/user/:id", protect, isAdmin, updateUser);


module.exports = router;