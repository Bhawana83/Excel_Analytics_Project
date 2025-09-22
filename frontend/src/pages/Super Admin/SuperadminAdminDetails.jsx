// SuperadminAdminDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Download, Trash2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const SuperadminAdminDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const fetchAdminDetails = async () => {
    if (!id) {
      setError("No Admin ID provided!");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.get(
        API_PATHS.SUPER_ADMIN.GET_ADMIN_DETAILS(id)
      );
      setUser(res.data.admin || null);
      setUploads(res.data.uploads || []);
    } catch (err) {
      console.error("Error fetching admin details:", err);
      setError("Failed to fetch admin details!");
      toast.error("Error loading admin details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.SUPERADMIN_FILE.DOWNLOAD_FILE(fileId),
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download.file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("✅ File downloaded");
    } catch (err) {
      console.error("❌ Error downloading:", err.message);
      toast.error("Download failed");
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axiosInstance.delete(
        API_PATHS.SUPERADMIN_FILE.DELETE_FILE(fileId)
      );
      toast.success("File Deleted Successfully");
      fetchAdminDetails();
    } catch (err) {
      console.error(
        "Error deleting file:",
        err.response?.data?.message || err.message
      );
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600 text-lg">Loading user details…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="Admins">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-500 font-semibold">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 shadow-md"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600">No admin found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 shadow-md"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border p-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-700">
              🛡️ Admin Details
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 shadow-md"
            >
              ← Back to All Admins
            </button>
          </div>

          {/* User Info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Info label="Name" value={user.name} />
            <Info label="Email" value={user.email} />
            <Info label="Role" value={user.role} badge="cyan" />
            <Info
              label="Status"
              value={user.status}
              badge={
                user.status === "active"
                  ? "green"
                  : user.status === "pending"
                  ? "yellow"
                  : "red"
              }
            />
            <Info
              label="Blocked"
              value={user.isBlocked ? "Yes" : "No"}
              badge={user.isBlocked ? "red" : "green"}
            />
            <Info label="Created At" value={formatDate(user.createdAt)} />
            <Info label="Updated At" value={formatDate(user.updatedAt)} />
          </div>

          {/* Uploaded Files */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-cyan-700 mb-4">
              📂 Uploaded Files ({uploads.length})
            </h3>

            {uploads.length === 0 ? (
              <p className="text-gray-500">No files uploaded by this admin.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm sm:text-base rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">File Name</th>
                      <th className="px-4 py-2 text-left">Size</th>
                      <th className="px-4 py-2 text-left">Uploaded At</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((file, index) => (
                      <tr
                        key={file._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{file.originalName}</td>
                        <td className="px-4 py-2">
                          {(file.size / 1024).toFixed(2)} KB
                        </td>
                        <td className="px-4 py-2">
                          {formatDate(file.createdAt)}
                        </td>
                        <td className="px-4 py-2 text-center space-x-3">
                          <button
                            onClick={() =>
                              handleDownload(file._id, file.originalName)
                            }
                            className="p-2 rounded-full hover:bg-cyan-100 text-cyan-600 transition cursor-pointer"
                            title="Download File"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(file._id)}
                            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition cursor-pointer"
                            title="Delete File"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

// Info component
const Info = ({ label, value, badge }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    {badge ? (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          badge === "green"
            ? "bg-green-100 text-green-700"
            : badge === "yellow"
            ? "bg-yellow-100 text-yellow-700"
            : badge === "red"
            ? "bg-red-100 text-red-700"
            : "bg-cyan-100 text-cyan-700"
        }`}
      >
        {value}
      </span>
    ) : (
      <p className="text-lg font-semibold">{value}</p>
    )}
  </div>
);

export default SuperadminAdminDetails;
