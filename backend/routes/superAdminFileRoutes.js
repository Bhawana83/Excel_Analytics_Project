const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { isSuperAdmin } = require("../middleware/roleMiddleware");
const { getUserFiles, downloadUserFile, deleteUserFile } = require("../controllers/superAdminFileController");


// ✅ Admin APIs
router.get("/:userId", protect, isSuperAdmin, getUserFiles);          // Get all files of a user
router.get("/download/:fileId", protect, isSuperAdmin, downloadUserFile); // Download specific file
router.delete("/:fileId", protect, isSuperAdmin, deleteUserFile);        // Delete specific file

module.exports = router;
