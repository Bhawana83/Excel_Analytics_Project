const fetch = require("node-fetch");
const XLSX = require("xlsx");
const Upload = require("../models/Upload.js");
const { getGFSBucket } = require("../utils/gridfsBucket.js");
const mongoose = require("mongoose");

//? Upload Excel file to server Controller
exports.handleExcelUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const gfsBucket = req.app.locals.gfsBucket;
    if (!gfsBucket)
      return res.status(500).json({ message: "GridFSBucket not initialized" });

    const { originalname, mimetype, size, buffer } = req.file;

    // 1. Store into GridFSBucket
    const uploadStream = gfsBucket.openUploadStream(originalname, {
      contentType: mimetype,
      metadata: {
        uploadedBy: req.user._id,
      },
    });

    // Write buffer and end stream
    uploadStream.end(buffer);

    // Wait for finish and get fileId
    const fileId = await new Promise((resolve, reject) => {
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", (err) => reject(err));
    });

    // 2. Parse Excel from buffer
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    // console.log(`jsonData : ${JSON.stringify(jsonData)}`);

    const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
    const length = jsonData.length;
    const sample = jsonData.slice(0, length);
    const insightPlaceholder = "Insight will be generated soon...";

    // 3. Save metadata
    const uploadDoc = await Upload.create({
      owner: req.user._id,
      originalName: originalname,
      gridFsId: fileId,
      mimeType: mimetype,
      size,
      columns,
      sample,
      insight: insightPlaceholder,
      parsedAt: new Date(),
      deleted: false,
    });

    res.status(201).json({
      message: "File uploaded to GridFSBucket and parsed",
      upload: uploadDoc,
      // columns,
      // sample,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in handleExcelUpload Controller : ",
      error: error.message,
    });
  }
};

//? Get a file parsed data
exports.getParsedUploadData = async (req, res) => {
  try {
    const uploadId = req.params.id;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(uploadId)) {
      return res.status(400).json({ message: "Invalid Upload ID" });
    }

    const upload = await Upload.findById(uploadId);

    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    // Ensure parsed data is available
    if (!upload.columns || !upload.sample) {
      return res
        .status(400)
        .json({ message: "File not parsed yet or missing columns/sample." });
    }

    // Return only sample rows (for now, for lightweight response)
    return res.json({
      message: "Parsed data fetched successfully",
      columns: upload.columns,
      rows: upload.sample || [], // depends on your sample structure
    });
  } catch (error) {
    console.error(
      "Error in getParsedUploadData Controller -  fetching parsed upload data:",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

//? Upload History Controller
exports.listUserUploads = async (req, res) => {
  try {
    // Find all uploads by the authenticated user
    const uploads = await Upload.find({ owner: req.user._id, deleted: false })
      .sort({ createdAt: -1 }) // Sort by latest uploads first
      .select("-__v") // Exclude MongoDB internal field
      .lean(); // Faster, plain JS Objects

    res.status(200).json({
      success: true,
      message: "Get User upload history",
      count: uploads.length,
      uploads,
    });
  } catch (error) {
    console.error("❌ Error fetching user uploads :", error.message);
    res.status(500).json({
      message: "Error in listUserUploads Controller : ",
      error: error.message,
    });
  }
};

//? Download File Controller
exports.downloadUploadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const upload = await Upload.findById(id);

    // Check file present or not
    if (!upload)
      return res.status(404).json({ message: "Upload File Not Found" });

    if (!upload.gridFsId)
      return res.status(500).json({
        message: "Missing GridFS reference",
      });

    // Get gfsBucket instance
    const gfsBucket = getGFSBucket();
    if (!gfsBucket)
      return res.status(500).json({ message: "GridFSBucket not initialized" });

    // Opening download stream
    const downloadStream = gfsBucket.openDownloadStream(upload.gridFsId);

    res.set("Content-Type", upload.mimeType);
    res.set(
      "Content-Disposition",
      `attachment; filename="${upload.originalName}"`
    );

    downloadStream.pipe(res);
    downloadStream.on("error", (error) => {
      throw error;
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in downloadUploadFile Controller : ",
      error: error.message,
    });
  }
};

//? Delete File Controller
exports.deleteUploadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findById(id);
    if (!upload)
      return res.status(404).json({ message: "Upload File Not Found" });

    const gfsBucket = getGFSBucket();
    if (!gfsBucket)
      return res.status(500).json({ message: "GridFSBucket not initialized" });

    // Delete the file from GridFS
    await gfsBucket.delete(new mongoose.Types.ObjectId(upload.gridFsId));

    // ✅ Soft delete the metadata instead of full deletion
    upload.deleted = true;
    upload.deletedAt = new Date(); // optional field
    await upload.save();

    // // Delete the metea from the Upload collection
    // await upload.deleteOne();

    res.json({
      message: "Upload and associated file deleted successfully.",
      deleteFile: upload,
    });
  } catch (error) {
    console.error("❌ Error during deleting upload file:", error.message);
    res.status(500).json({
      message: "Error in downloadUploadFile Controller : ",
      error: error.message,
    });
  }
};

//? Get AI Insights Controller
exports.getAiInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedData = await getParsedUploadDataDirect(id); // your helper
    if (!parsedData || !parsedData.rows?.length) {
      return res.status(400).json({ message: "No data found in file" });
    }

    const summary = {
      columns: parsedData.columns,
      sampleRows: parsedData.rows.slice(0, parsedData.rows.length),
    };

    const promptText = `
You are a data analyst. Given this dataset, generate 5–8 bullet-point insights (trends, anomalies, correlations):

${JSON.stringify(summary, null, 2)}
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: promptText }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Groq API Error: ${data.error?.message || response.statusText}`);
    }

    const insights = data.choices[0].message.content
      .split("\n")
      .filter((line) => line.trim());

    res.json({ insights });
  } catch (err) {
    console.error("❌ AI Insights Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Helper: call DB directly instead of HTTP request
async function getParsedUploadDataDirect(uploadId) {
  const upload = await Upload.findById(uploadId);
  if (!upload) return null;
  return { columns: upload.columns, rows: upload.sample || [] };
}



//cors--
//dotenv to keep our secret password safe
//jsonwebtoken-- unique token generation 
//mongoose-- to work with database easily
//multer--to store and upload file
//xlsx --