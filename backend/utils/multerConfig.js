const multer = require("multer");

// Use memoryStorage so file is in req.file.buffer
const storage = multer.memoryStorage(); //temporary store files

const fileFilter = (req, file, cb) => {  //cb - callback function
  const allowed = [".xlsx", ".xls"];   //allowing extension
  const ext = file.originalname
    .slice(file.originalname.lastIndexOf(".")) //slice method -- cut string into subparts and returns required string after the index provided.
    .toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(new Error("Only Excel files aree allowed"), false);
  }

  cb(null, true);
};

const uploadExcel = multer({
  storage,
  fileFilter,
  limits: { fileSize: 16 * 1024 * 1024 }, // 16 mbfile size limit setting here 
});

module.exports = uploadExcel;


//cb is a built in function comes in filefilter and we have to call this function
//memory storage: filefilter comes under this stored file in database directly 
