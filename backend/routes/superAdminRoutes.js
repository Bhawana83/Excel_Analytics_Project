const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { isSuperAdmin } = require("../middleware/roleMiddleware");
const {
  approveAdmin,
  getAllAdmins,
  rejectAdmin,
  getAllUsers,
  createUser,
  updateUser,
  getUserDetails,
  deleteUser,
  toggleBlockUser,
  getAdminDetails,
} = require("../controllers/superAdminController");

const router = express.Router();

// Routes only super-admin can access

// ✅ Get all users
router.get("/users", protect, isSuperAdmin, getAllUsers);

// ✅ Get all admins (pending + active + rejected)
router.get("/admins", protect, isSuperAdmin, getAllAdmins);

// ✅ Approve / Reject Admin
router.put("/approved/:adminId", protect, isSuperAdmin, approveAdmin);
router.put("/rejected/:adminId", protect, isSuperAdmin, rejectAdmin);

// ✅ New routes - Creating & updating user/admin
router.post("/user", protect, isSuperAdmin, createUser);
router.put("/user/:id", protect, isSuperAdmin, updateUser);

// ✅ To get particular user details
router.get("/user/:id", protect, isSuperAdmin, getUserDetails);

// ✅ To get particular admindetails
router.get("/admin/:id", protect, isSuperAdmin, getAdminDetails);

// ✅ Deleting and blocking users/admins
router.delete("/user/:id", protect, isSuperAdmin, deleteUser);
router.patch("/user/:id/block", protect, isSuperAdmin, toggleBlockUser);


module.exports = router;
