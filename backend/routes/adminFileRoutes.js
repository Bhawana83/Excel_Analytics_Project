const express = require("express");
const router = express.Router();
 
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const { getUserFiles, downloadUserFile, deleteUserFile } = require("../controllers/adminFileController");


// ✅ Admin APIs
router.get("/:userId", protect, isAdmin, getUserFiles);          // Get all files of a user
router.get("/download/:fileId", protect, isAdmin, downloadUserFile); // Download specific file
router.delete("/:fileId", protect, isAdmin, deleteUserFile);        // Delete specific file

module.exports = router;
