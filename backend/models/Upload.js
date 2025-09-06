const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },
//directly used gridfsbucket to store data in small chunks
    gridFsId: {  /// high model api, divides into small parts and stores in small chunks in different doc, metadata storage
      // GridFs File Reference
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    mimeType: {
      type: String,
    },

    size: {
      type: Number,
    },

    uploadDate: {
      type: Date,
      default: Date.now,
    },

    columns: {
      type: [String],
      default: [],
    },

    sample: {
      type: Object,
    },

    insight: {
      type: String,
    },

    parsedAt: {
      type: Date,
    },

    // ✅ Soft delete tracking
    deleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
