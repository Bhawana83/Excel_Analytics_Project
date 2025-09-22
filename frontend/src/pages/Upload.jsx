import { useState } from "react";
import { FileUp, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";

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

      await axiosInstance.post(API_PATHS.UPLOAD.UPLOAD_FILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
      <div className="my-10 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-100 rounded-3xl shadow-xl p-10 flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500 text-center">
            📁 Upload Excel File
          </h2>

          {/* File Input Area */}
          <label
            htmlFor="fileInput"
            className="w-full flex flex-col items-center justify-center py-16 border-2 border-dashed border-cyan-300 rounded-2xl cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition relative"
          >
            {file ? (
              <>
                <FileUp size={48} className="text-cyan-600" />
                <p className="mt-3 text-lg font-semibold text-gray-800 truncate">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">Click to change file</p>
              </>
            ) : (
              <>
                <FileUp size={48} className="text-cyan-400" />
                <p className="mt-3 text-lg text-gray-600">
                  Click or drag & drop Excel file
                </p>
                <p className="text-sm text-gray-400">
                  Only .xls and .xlsx files are supported
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
            className="w-full py-3 px-6 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Uploading...
              </>
            ) : (
              "Start Upload"
            )}
          </button>

          {/* Status Feedback */}
          {uploadSuccess && (
            <div className="absolute top-5 right-5 flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-xl shadow-md text-sm">
              <CheckCircle2 size={18} /> Uploaded successfully
            </div>
          )}
          {uploadError && (
            <div className="absolute top-5 right-5 flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-xl shadow-md text-sm">
              <XCircle size={18} /> Upload failed
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;

// import { useState } from "react";
// import { FileUp, Loader2, CheckCircle2, XCircle } from "lucide-react";
// import { toast } from "react-toastify";

// import DashboardLayout from "../components/Layout/DashboardLayout";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";

// const Upload = () => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadError, setUploadError] = useState(false);

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (
//       selected &&
//       (selected.type ===
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//         selected.type === "application/vnd.ms-excel")
//     ) {
//       setFile(selected);
//       setUploadError(false);
//       setUploadSuccess(false);
//     } else {
//       setFile(null);
//       toast.error("Only Excel files (.xls, .xlsx) are allowed");
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       toast.error("Please select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setUploading(true);
//       setUploadError(false);
//       setUploadSuccess(false);

//       await axiosInstance.post(API_PATHS.UPLOAD.UPLOAD_FILE, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("File uploaded successfully!");
//       setUploadSuccess(true);
//       setFile(null);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Upload failed");
//       setUploadError(true);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <DashboardLayout activeMenu="Upload">
//       <div className="my-10 mx-auto max-w-2xl px-4">
//         <div
//           className="relative backdrop-blur-lg bg-white/70 border border-gray-200
//           rounded-2xl shadow-xl p-8 transition"
//         >
//           <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
//             Upload Excel File
//           </h2>

//           {/* File Input Area */}
//           <label
//             htmlFor="fileInput"
//             className="flex flex-col items-center justify-center w-full py-12 border-2 border-dashed border-gray-300
//             rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition"
//           >
//             {file ? (
//               <>
//                 <FileUp size={40} className="text-indigo-600" />
//                 <p className="mt-3 text-base font-medium text-gray-800">
//                   {file.name}
//                 </p>
//                 <p className="text-xs text-gray-500">Click to change file</p>
//               </>
//             ) : (
//               <>
//                 <FileUp size={40} className="text-gray-500" />
//                 <p className="mt-3 text-base text-gray-600">
//                   Click or drag & drop Excel file
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Supports only .xls and .xlsx
//                 </p>
//               </>
//             )}
//           </label>
//           <input
//             id="fileInput"
//             type="file"
//             accept=".xls,.xlsx"
//             onChange={handleFileChange}
//             className="hidden"
//           />

//           {/* Upload Button */}
//           <button
//             onClick={handleUpload}
//             disabled={!file || uploading}
//             className="mt-8 w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
//             hover:bg-indigo-700 hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {uploading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <Loader2 size={18} className="animate-spin" />
//                 Uploading...
//               </span>
//             ) : (
//               "Start Upload"
//             )}
//           </button>

//           {/* Status Feedback */}
//           {uploadSuccess && (
//             <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm shadow-sm">
//               <CheckCircle2 size={16} /> Uploaded successfully
//             </div>
//           )}
//           {uploadError && (
//             <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm shadow-sm">
//               <XCircle size={16} /> Upload failed
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Upload;
