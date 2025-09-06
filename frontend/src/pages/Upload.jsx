import { useState } from "react";
import { FileUp, Loader2, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/Layout/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selected.type === "application/vnd.ms-excel")
    ) {
      setFile(selected);
      setUploadError(false);
      setUploadSuccess(false);
    } else {
      setFile(null);
      toast.error("Only Excel files (.xls, .xlsx) are allowed");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setUploadError(false);
      setUploadSuccess(false);

      const response = await axiosInstance.post(API_PATHS.UPLOAD.UPLOAD_FILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${token}`, // Uncomment if needed
        },
      });

      toast.success("File uploaded successfully!");
      setUploadSuccess(true);
      setFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Upload">
      <div className="my-5 mx-auto">
        <div className="max-w-[1000px] mx-auto bg-white p-6 rounded-xl shadow-lg mt-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-center">
            📤 Upload Excel File
          </h2>

          <div className="flex flex-col items-center justify-center gap-4">
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 rounded-lg w-full h-40 cursor-pointer hover:bg-indigo-50 transition"
            >
              {file ? (
                <>
                  <FileUp size={28} className="text-indigo-500" />
                  <p className="mt-2 text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">Click to change file</p>
                </>
              ) : (
                <>
                  <FileUp size={28} className="text-indigo-500" />
                  <p className="mt-2 text-sm">Click or drag file to upload</p>
                  <p className="text-xs text-gray-500">
                    Only .xls and .xlsx files
                  </p>
                </>
              )}
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Upload"
              )}
            </button>

            {/* Status Feedback */}
            {uploadSuccess && (
              <div className="flex items-center text-green-600 text-sm gap-2">
                <CheckCircle2 size={18} />
                File uploaded successfully
              </div>
            )}
            {uploadError && (
              <div className="flex items-center text-red-600 text-sm gap-2">
                <XCircle size={18} />
                Failed to upload file
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;
