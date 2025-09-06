const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { handleExcelUpload, listUserUploads, downloadUploadFile, deleteUploadFile, getAiInsights, getParsedUploadData,  } = require("../controllers/uploadControllers");
// listUserUploads, downloadUploadFile
const  uploadaExcel  = require("../utils/multerConfig");

const router = express.Router();

router.post("/", protect, uploadaExcel.single("file"), handleExcelUpload);  // upload krne ke liye home route meaing - /api/upload par post 
router.get('/history', protect, listUserUploads); // ye dono chal rhe ab 3rd wala test kr skti hai
router.get('/:id/data', protect, getParsedUploadData); //yh bi ho gya
router.get('/download/:id', protect, downloadUploadFile);
router.delete('/:id',protect,deleteUploadFile);
router.get("/insights/:id", protect, getAiInsights);  //ab yh
module.exports = router;

// sun mene woh ek folder bheja tha na fronend aur back
