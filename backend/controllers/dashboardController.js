const Upload = require("../models/Upload");
const { Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch Total Uploads
    const totalUploads = await Upload.countDocuments({ owner: userObjectId });
    const currentUploads = await Upload.countDocuments({
      owner: userObjectId,
      deleted: false,
    });

    const deleteUploads = await Upload.countDocuments({
      owner: userObjectId,
      deleted: true,
    });

    // Fetch last 5 Uploads
    const recentUploads = await Upload.find({ owner: userId }) // includes both deleted: true & false
      // .sort({ createdAt: -1 }) // ❌ only sorts by upload time
      .sort({ updatedAt: -1 }) // ✅ includes recent deletes too
      .limit(5);

    const labeledUploads = recentUploads.map((upload) => ({
      ...upload.toObject(),
      status: upload.deleted ? "deleted" : "current",
    }));

    return res.status(200).json({
      totalUploads,
      currentUploads,
      deleteUploads,
      recentUploads: labeledUploads,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in dashboard Controller - fetching dashboard data",
      error: error.message,
    });
  }
};
