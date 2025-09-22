const mongoose = require("mongoose");
const Upload = require("../models/Upload");
const { getGFSBucket } = require("../utils/gridfsBucket");

let gfsBucket = null;
setTimeout(() => {
  gfsBucket = getGFSBucket();
  console.log('GridFSBucket initialized in controller');
}, 3500);

// ✅ Get all files uploaded by a specific user
exports.getUserFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const files = await gfsBucket.find({ "metadata.uploadedBy": userId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found for this user." });
    }

    res.json({
      success: true,
      count: files.length,
      files,
    });
  } catch (err) {
    console.error("Error fetching user files:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Download file
exports.downloadUserFile = async (req, res) => {
  try {
    
    const upload = await Upload.findById(req.params.fileId);
    
    if (!upload) {
      return res.status(404).json({ message: "File not found" });
    }

    // ✅ Use fileId from Upload model to stream from GridFS
    const file = await gfsBucket.find({ _id: upload.gridFsId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found in GridFS" });
    }

    res.set("Content-Type", file[0].contentType);
    res.set("Content-Disposition", `attachment; filename="${upload.originalName}"`);

    const downloadStream = gfsBucket.openDownloadStream(upload.gridFsId);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Error downloading file", error: err.message });
  }
};


// ✅ Delete file (from GridFS + Upload model)
exports.deleteUserFile = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.fileId);
    if (!upload) {
      return res.status(404).json({ message: "File not found in Uploads model" });
    }

    // ✅ Delete from GridFS (uploads.files + uploads.chunks)
    try {
      await gfsBucket.delete(new mongoose.Types.ObjectId(upload.gridFsId));
    } catch (gridfsErr) {
      console.warn("GridFS delete failed or file not found:", gridfsErr.message);
    }

    // ✅ Delete from Upload model collection
    await Upload.findByIdAndDelete(req.params.fileId);

    res.json({ success: true, message: "File deleted successfully from both Upload model and GridFS" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ success: false, message: "Error deleting file", error: err.message });
  }
};
