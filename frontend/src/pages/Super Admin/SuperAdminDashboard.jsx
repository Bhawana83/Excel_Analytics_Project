import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.SUPER_ADMIN.GET_ALL_ADMINS);
      setAdmins(res.data.admins || []);
    } catch (err) {
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filter admins
  const filteredAdmins = admins.filter((admin) =>
    filter === "all" ? true : admin.status === filter
  );

  // Pagination
  const totalPages = Math.ceil(filteredAdmins.length / pageSize);
  const indexOfLastAdmin = currentPage * pageSize;
  const indexOfFirstAdmin = indexOfLastAdmin - pageSize;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );

  // Approve admin
  const handleApprove = async (id) => {
    try {
      const res = await axiosInstance.put(API_PATHS.SUPER_ADMIN.APPROVED(id));
      if (res.data.success) {
        toast.success("Admin approved successfully!");
        fetchAdmins();
      }
    } catch {
      toast.error("Failed to approve admin");
    }
  };

  // Reject admin
  const handleReject = async (id) => {
    try {
      const res = await axiosInstance.put(API_PATHS.SUPER_ADMIN.REJECTED(id));
      if (res.data.success) {
        toast("Admin rejected", { icon: "🚫" });
        fetchAdmins();
      }
    } catch {
      toast.error("Failed to reject admin");
    }
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-sky-50 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-extrabold text-cyan-700 drop-shadow-sm">
              🛡️ Super Admin Dashboard
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold shadow-sm">
                Total Admins: {filteredAdmins.length}
              </span>
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="pending">Pending</option>
                <option value="active">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Main Grid */}
          {loading ? (
            <p className="text-center text-gray-500">Loading admins…</p>
          ) : filteredAdmins.length === 0 ? (
            <p className="text-center text-gray-500">No admins found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentAdmins.map((admin, index) => (
                <motion.div
                  key={admin._id}
                  whileHover={{ scale: 1.03 }}
                  className="relative bg-white border border-cyan-200 rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition-all"
                >
                  {/* Admin Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-sky-700">
                      {indexOfFirstAdmin + index + 1}. {admin.name}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
                      {admin.email}
                    </p>
                    <p className="text-sm text-cyan-600 font-medium">
                      Role: {admin.role}
                    </p>
                    <p
                      className={`mt-1 font-semibold ${
                        admin.status === "active"
                          ? "text-green-600"
                          : admin.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      Status: {admin.status}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApprove(admin._id)}
                      disabled={admin.status === "active"}
                      className="px-3 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(admin._id)}
                      disabled={admin.status === "rejected"}
                      className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 transition"
                    >
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center sm:justify-end mt-8 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
