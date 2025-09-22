import DashboardLayout from "../../src/components/Layout/DashboardLayout"; 
import { Download, Trash2, FileText } from "lucide-react";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useGetUserUploads from "../hooks/useGetUserUploads";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const History = () => {
  const { uploads, loading, fetchUploads } = useGetUserUploads();
  const navigate = useNavigate();

  // Delete File
  const deleteFile = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.UPLOAD.DELETE_FILE(id));
      toast.success("File Deleted Successfully");
      fetchUploads();
    } catch (error) {
      console.error(
        "Error Deleting File : ",
        error.response?.data?.message || error.message
      );
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Download Handler
  const handleDownload = async (fileId, fileName) => {
    try {
      if (!fileId) throw new Error("File ID is missing");
      const response = await axiosInstance.get(
        API_PATHS.UPLOAD.DOWNLOAD_FILE(fileId),
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error in Downloading File:", error.message);
    }
  };

  return (
    <DashboardLayout activeMenu="History">
      <div className="my-6 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-sky-500 bg-clip-text text-transparent">
            📂 Upload History
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Browse, download, or delete your uploaded files.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-cyan-600 font-medium animate-pulse">
            Fetching your upload history...
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploads.map((file, index) => {
            const date = moment(file.uploadDate).format("Do MMM YYYY");
            return (
              <div
                key={file._id}
                className="rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-50 shadow-lg border border-cyan-100 p-6 flex flex-col hover:shadow-2xl transition-all"
              >
                {/* File Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-cyan-100 rounded-xl">
                    <FileText className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {file.originalName}
                    </h3>
                    <p className="text-xs text-gray-500">#{index + 1}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      file.deleted !== true
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {file.deleted !== true ? "Uploaded" : "Deleted"}
                  </span>
                </div>

                {/* File Info */}
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>
                    <span className="font-medium">Size:</span>{" "}
                    {formatFileSize(file.size)}
                  </p>
                  <p>
                    <span className="font-medium">Uploaded:</span> {date}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => handleDownload(file._id, file.originalName)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 text-white text-sm hover:bg-cyan-700 transition"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button
                    onClick={() => deleteFile(file._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            );
          })}

          {!loading && uploads.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No uploads found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;









// import DashboardLayout from "../../src/components/Layout/DashboardLayout";
// import { Download, Trash2, FileText } from "lucide-react";
// import moment from "moment";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import useGetUserUploads from "../hooks/useGetUserUploads";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";

// const History = () => {
//   const { uploads, loading, fetchUploads } = useGetUserUploads();
//   const navigate = useNavigate();

//   // Delete File
//   const deleteFile = async (id) => {
//     try {
//       await axiosInstance.delete(API_PATHS.UPLOAD.DELETE_FILE(id));
//       toast.success("File Deleted Successfully");
//       fetchUploads();
//     } catch (error) {
//       console.error(
//         "Error Deleting File : ",
//         error.response?.data?.message || error.message
//       );
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // Download Handler
//   const handleDownload = async (fileId, fileName) => {
//     try {
//       if (!fileId) throw new Error("File ID is missing");
//       const response = await axiosInstance.get(
//         API_PATHS.UPLOAD.DOWNLOAD_FILE(fileId),
//         { responseType: "blob" }
//       );
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = fileName || "download.xlsx";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("❌ Error in Downloading File:", error.message);
//     }
//   };

//   return (
//     <DashboardLayout activeMenu="History">
//       <div className="my-6 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//         {/* Heading */}
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
//             📂 Upload History
//           </h1>
//           <p className="text-gray-500 mt-2 text-sm">
//             Browse, download, or delete your uploaded files.
//           </p>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-10 text-indigo-600 font-medium animate-pulse">
//             Fetching your upload history...
//           </div>
//         )}

//         {/* Cards Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {uploads.map((file, index) => {
//             const date = moment(file.uploadDate).format("Do MMM YYYY");
//             return (
//               <div
//                 key={file._id}
//                 className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md border border-indigo-100 p-6 flex flex-col hover:shadow-xl transition-all"
//               >
//                 {/* File Header */}
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-3 bg-indigo-100 rounded-xl">
//                     <FileText className="w-6 h-6 text-indigo-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 truncate">
//                       {file.originalName}
//                     </h3>
//                     <p className="text-xs text-gray-500">#{index + 1}</p>
//                   </div>
//                 </div>

//                 {/* Status Badge */}
//                 <div className="mb-3">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//                       file.deleted !== true
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-600"
//                     }`}
//                   >
//                     {file.deleted !== true ? "Uploaded" : "Deleted"}
//                   </span>
//                 </div>

//                 {/* File Info */}
//                 <div className="text-sm text-gray-600 space-y-1 mb-4">
//                   <p>
//                     <span className="font-medium">Size:</span>{" "}
//                     {formatFileSize(file.size)}
//                   </p>
//                   <p>
//                     <span className="font-medium">Uploaded:</span> {date}
//                   </p>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3 mt-auto">
//                   <button
//                     onClick={() => handleDownload(file._id, file.originalName)}
//                     className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
//                   >
//                     <Download className="w-4 h-4" /> Download
//                   </button> 
//                   <button
//                     onClick={() => deleteFile(file._id)}
//                     className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
//                   >
//                     <Trash2 className="w-4 h-4" /> Delete
//                   </button>
//                 </div>
//               </div>
//             );
//           })}

//           {!loading && uploads.length === 0 && (
//             <div className="col-span-full text-center py-12 text-gray-400">
//               No uploads found.
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default History;



// import DashboardLayout from "../../src/components/Layout/DashboardLayout";
// import { Download, Trash2 } from "lucide-react";
// import moment from "moment";
// import { useContext } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import useGetUserUploads from "../hooks/useGetUserUploads";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";

// const History = () => {
//   const { uploads, loading, fetchUploads } = useGetUserUploads();
//   const navigate = useNavigate();

//   // Delete File
//   const deleteFile = async (id) => {
//     try {
//       await axiosInstance.delete(API_PATHS.UPLOAD.DELETE_FILE(id));
//       toast.success("File Deleted Successfully");
//       fetchUploads(); // re-fetch the list
//     } catch (error) {
//       console.error(
//         "Error Deleting File : ",
//         error.response?.data?.message || error.message
//       );
//     }
//   };

//   // Helper: Format file size in readable units
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // Handler for downloading file
//   const handleDownload = async (fileId, fileName) => {
//     try {
//       if (!fileId) {
//         throw new Error("File ID is missing");
//       }

//       const response = await axiosInstance.get(
//         API_PATHS.UPLOAD.DOWNLOAD_FILE(fileId),
//         {
//           responseType: "blob",
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = fileName || "download.xlsx"; 
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("❌ Error in Downloading File:", error.message);
//     }
//   };

//   return (
//     <DashboardLayout activeMenu="History">
//       <div className="my-6 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
//         {/* Heading */}
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
//             📂 User Upload History
//           </h1>
//           <p className="text-gray-500 mt-2 text-sm">
//             Manage and review your uploaded files.
//           </p>
//         </div>

//         {/* Loading Indicator */}
//         {loading && (
//           <div className="text-center py-8 text-cyan-600 font-medium animate-pulse">
//             Loading upload history...
//           </div>
//         )}

//         {/* Table */}
//         <div className="overflow-x-auto bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg rounded-2xl border border-cyan-100">
//           <table className="min-w-full text-sm text-gray-700">
//             <thead className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white sticky top-0 text-center">
//               <tr>
//                 <th className="px-6 py-3 whitespace-nowrap">Sr No.</th>
//                 <th className="px-6 py-3 whitespace-nowrap">File Name</th>
//                 <th className="px-6 py-3 whitespace-nowrap">Status</th>
//                 <th className="px-6 py-3 whitespace-nowrap">Size</th>
//                 <th className="px-6 py-3 whitespace-nowrap">Uploaded At</th>
//                 <th className="px-6 py-3 text-center whitespace-nowrap">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {uploads.map((file, index) => {
//                 let date = moment(file.uploadDate).format("Do MMM YYYY");
//                 return (
//                   <tr
//                     key={file._id}
//                     className="hover:bg-cyan-50 transition-all border-b border-gray-200"
//                   >
//                     <td className="px-6 py-4 font-medium text-gray-800">
//                       {index + 1}
//                     </td>
//                     <td className="px-6 py-4 text-gray-800 font-semibold">
//                       {file.originalName}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
//                           file.deleted !== true
//                             ? "bg-cyan-100 text-cyan-700"
//                             : "bg-red-100 text-red-600"
//                         }`}
//                       >
//                         {file.deleted !== true ? "Uploaded" : "Deleted"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">{formatFileSize(file.size)}</td>
//                     <td className="px-6 py-4">{date}</td>
//                     <td className="px-6 py-4 text-center">
//                       <div className="flex justify-center gap-3">
//                         <button
//                           title="Download"
//                           className="p-2 rounded-full bg-white shadow-md hover:bg-cyan-100 text-cyan-600 transition cursor-pointer"
//                           onClick={() =>
//                             handleDownload(file._id, file.originalName)
//                           }
//                         >
//                           <Download size={18} />
//                         </button>
//                         <button
//                           title="Delete"
//                           className="p-2 rounded-full bg-white shadow-md hover:bg-red-100 text-red-600 transition cursor-pointer"
//                           onClick={() => deleteFile(file._id)}
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {!loading && uploads.length === 0 && (
//                 <tr>
//                   <td colSpan="6" className="text-center py-6 text-gray-400">
//                     No uploads found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default History;


