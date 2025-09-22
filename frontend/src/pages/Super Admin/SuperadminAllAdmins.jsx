// SuperadminAllAdmins.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { Edit, Eye, Trash2 } from "lucide-react";
import SuperAdminUserModal from "./SuperAdminAddUserModal";

const SuperadminAllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      console.log('entering')
      const res = await axiosInstance.get(API_PATHS.SUPER_ADMIN.GET_ALL_ADMINS);
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error("Failed to fetch admins!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ✅ Open modal for add
  const handleAddAdmin = () => {
    setModalMode("add");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // ✅ Open modal for edit
  const handleEditAdmin = (admin) => {
    setModalMode("edit");
    setSelectedUser(admin);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await axiosInstance.delete(API_PATHS.SUPER_ADMIN.DELETE_USER(id));
      if (res.data.success) {
        toast.success("User deleted successfully");
        fetchAdmins();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete admin");
    }
  };

  const totalPages = Math.ceil(admins.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = admins.slice(startIndex, startIndex + pageSize);

  return (
    <DashboardLayout activeMenu="Admins">
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-3 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-cyan-100 p-4 sm:p-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-700">
              🛡️ All Admins
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium shadow-sm">
                Total: {admins.length}
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={30}>30 / page</option>
                <option value={50}>50 / page</option>
              </select>

              <button
                className=" lg:px-6 px-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:shadow-blue-900/20 dark:hover:shadow-blue-900/40 disabled:opacity-70 disabled:cursor-not-allowed select-none"
                onClick={handleAddAdmin}
              >
                Add Admin
              </button>
            </div>

            <SuperAdminUserModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              mode={modalMode}
              user={selectedUser}
              onUserUpdated={fetchAdmins}
              userRole={"admin"}
            />
          </div>

          {/* Table for medium+ screens */}
          {loading ? (
            <p className="text-center text-gray-500">Loading users…</p>
          ) : admins.length === 0 ? (
            <p className="text-center text-gray-500">No admins found.</p>
          ) : (
            <>
              {/* Table */}
              <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm sm:text-base">
                  <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3">Sr. No</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Blocked</th>
                      <th className="px-4 py-3 text-left">Created At</th>
                      <th className="px-4 py-3 text-left">Updated At</th>
                      <th colSpan={2} className="px-4 py-3 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((admin, index) => (
                      <tr
                        key={admin._id}
                        className="border-b hover:bg-cyan-50 transition"
                      >
                        <td className="px-4 py-3 text-center text-gray-600">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3">{admin.name}</td>
                        <td className="px-4 py-3">{admin.email}</td>
                        <td className="px-4 py-3">{admin.role}</td>
                        <td
                          className={`px-4 py-3 font-semibold ${
                            admin.status === "active"
                              ? "text-cyan-600"
                              : admin.status === "pending"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {admin.status}
                        </td>
                        <td className="text-center">
                          {admin.isBlocked ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(admin.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(admin.updatedAt)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/super-admin/admin/${admin._id}`)
                              }
                              className="px-2 py-1 rounded bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditAdmin(admin)}
                              className="px-2 py-1 rounded bg-yellow-600 dark:bg-yellow-700 text-white hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-all duration-300 cursor-pointer"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(admin._id)}
                              className="px-2 py-1 rounded bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-4">
                {currentUsers.map((admin, index) => (
                  <div
                    key={admin._id}
                    className="p-4 bg-white rounded-lg border shadow hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-cyan-700">
                        {admin.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        #{startIndex + index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Role:</span> {admin.role}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        admin.status === "active"
                          ? "text-cyan-600"
                          : admin.status === "pending"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {admin.status}
                    </p>
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() =>
                          navigate(`/super-admin/admin/${admin._id}`)
                        }
                        className="px-2 py-1 rounded bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="px-2 py-1 rounded bg-yellow-600 dark:bg-yellow-700 text-white hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-all duration-300 cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="px-2 py-1 rounded bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center sm:justify-end mt-6 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SuperadminAllAdmins;
