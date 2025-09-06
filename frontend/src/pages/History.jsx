import DashboardLayout from "../../src/components/Layout/DashboardLayout";
import { Download, Trash2 } from "lucide-react";
import moment from "moment";
import { useContext } from "react";
import toast from "react-hot-toast";
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
      fetchUploads(); // re-fatch the list
    } catch (error) {
      console.error(
        "Error Deleting File : ",
        error.response?.data?.message || error.message
      );
    }
  };

  // Helper: Format file size in readable units
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handler for downloading file
  const handleDownload = async (fileId, fileName) => {
    try {
      if (!fileId) {
        throw new Error("File ID is missing");
      }

      const response = await axiosInstance.get(
        API_PATHS.UPLOAD.DOWNLOAD_FILE(fileId),
        {
          responseType: "blob",
        }
      );

      // ✅ Create a blob URL from the binary data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download.xlsx"; // Default filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      console.log("✅ File downloaded successfully");
    } catch (error) {
      console.error("❌ Error in Downloading File:", error.message);
    }
  };

  return (
    <DashboardLayout activeMenu="History">
      <div className="my-6 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">
            📂 User Upload File History
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Review your uploaded files and actions.
          </p>
        </div>

        {/* Loading Indicator for fetching details */}
        {loading && (
          <div className="text-center py-8 text-indigo-500 font-medium">
            Loading upload history...
          </div>
        )}

        {/* Responsive Table Container */}
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800 sticky top-0 text-center">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Sr No.</th>
                <th className="px-6 py-3 whitespace-nowrap">File Name</th>
                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                <th className="px-6 py-3 whitespace-nowrap">Size</th>
                <th className="px-6 py-3 whitespace-nowrap">Uploaded At</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {uploads.map((file, index) => {
                let date = moment(file.uploadDate).format("Do MMM YYYY");
                return (
                  <tr
                    key={file._id}
                    className="hover:bg-gray-50 border-b transition-all"
                  >
                    <td className="px-6 py-4 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">
                        {file.originalName}
                      </div>
                      {/* Showing date below the file name */}
                      {/* <div className="text-xs text-gray-500 mt-1">
                      {date}
                    </div> */}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          file.deleted !== true
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {file.deleted !== true ? "Uploaded" : "Deleted"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4">{date}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          title="Download"
                          className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition cursor-pointer"
                          onClick={() =>
                            handleDownload(file._id, file.originalName)
                          }
                        >
                          <Download size={18} />
                        </button>
                        <button
                          title="Delete"
                          className="p-2 rounded-full hover:bg-red-100 text-red-600 transition cursor-pointer"
                          onClick={() => deleteFile(file._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && uploads.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No uploads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;
