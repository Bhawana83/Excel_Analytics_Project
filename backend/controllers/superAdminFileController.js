const mongoose = require("mongoose");
const Upload = require("../models/Upload");

// No need for global gfsBucket initialization here; rely on app.locals
let gfsBucket = null; // Fallback variable, used only if app.locals is unavailable

// Function to get the gfsBucket, prioritizing app.locals
const getGfsBucketFromApp = (req) => {
  if (req.app.locals.gfsBucket) {
    return req.app.locals.gfsBucket;
  }
  if (!gfsBucket) {
    console.warn("Falling back to lazy initialization of gfsBucket");
    gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    if (!gfsBucket) {
      throw new Error("GridFSBucket not initialized. Ensure initGridFSBucket(app) was called.");
    }
    console.log("GridFSBucket lazily initialized in controller");
  }
  return gfsBucket;
};

// ✅ Get all files uploaded by a specific user
exports.getUserFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const gfsBucket = getGfsBucketFromApp(req);
    const files = await gfsBucket
      .find({ "metadata.uploadedBy": userId })
      .toArray();

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

    const gfsBucket = getGfsBucketFromApp(req);
    const file = await gfsBucket.find({ _id: upload.gridFsId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found in GridFS" });
    }

    res.set("Content-Type", file[0].contentType);
    res.set(
      "Content-Disposition",
      `attachment; filename="${upload.originalName}"`
    );

    const downloadStream = gfsBucket.openDownloadStream(upload.gridFsId);
    downloadStream.pipe(res);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error downloading file", error: err.message });
  }
};

// ✅ Delete file (from GridFS + Upload model)
// exports.deleteUserFile = async (req, res) => {
//   try {
//     const upload = await Upload.findById(req.params.fileId);
//     if (!upload) {
//       return res
//         .status(404)
//         .json({ message: "File not found in Uploads model" });
//     }

//     const gfsBucket = getGfsBucketFromApp(req);

//     // ✅ Delete from GridFS (uploads.files + uploads.chunks)
//     try {
//       await gfsBucket.delete(new mongoose.Types.ObjectId(upload.gridFsId));
//     } catch (gridfsErr) {
//       console.warn(
//         "GridFS delete failed or file not found:",
//         gridfsErr.message
//       );
//     }

//     // ✅ Soft delete the metadata instead of full deletion
//     upload.deleted = true;
//     upload.deletedAt = new Date(); // optional field
//     await upload.save();

//     // Delete the meta from the Upload collection
//     // await upload.deleteOne();

//     res.json({
//       success: true,
//       message: "File deleted successfully from both Upload model and GridFS",
//     });
//   } catch (err) {
//     console.error("Error deleting file:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting file",
//       error: err.message,
//     });
//   }
// };
//* Socket IO - Delete file
exports.deleteUserFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const upload = await Upload.findById(fileId);
    if (!upload) {
      return res
        .status(404)
        .json({ success: false, message: "File not found in Uploads model" });
    }

    const gfsBucket = getGfsBucketFromApp(req);
    if (!gfsBucket) {
      throw new Error("GridFSBucket not initialized");
    }

    // ✅ Delete from GridFS (uploads.files + uploads.chunks)
    await gfsBucket.delete(new mongoose.Types.ObjectId(upload.gridFsId));

    // ✅ Hard delete the metadata from the Upload collection
    await upload.deleteOne();

    // Emit Socket.IO event for file deletion
    if (req.io) {
      req.io.to("superadmin").emit("file_deleted", {
        uploadId: fileId,
        ownerId: upload.owner.toString(),
        deletedAt: new Date(),
      });
      // Optionally emit to the specific admin's room
      req.io.to(`admin_${upload.owner}`).emit("file_deleted", {
        uploadId: fileId,
        ownerId: upload.owner.toString(),
        deletedAt: new Date(),
      });
    } else {
      console.warn("Socket.IO not available in request context");
    }

    res.json({
      success: true,
      message: "File deleted successfully from both Upload model and GridFS",
    });
  } catch (err) {
    console.error("Error deleting file:", err.message);

    // Rollback logic if GridFS delete fails (optional, depending on your needs)
    if (err.name === "MongoError" || err.message.includes("GridFS")) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete file from GridFS",
        error: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: err.message,
    });
  }
};
