import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ban } from "lucide-react"; // 🚫 Icon for rejected
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const RejectedAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch all rejected admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.SUPER_ADMIN.GET_ALL_ADMINS);
      const rejectedAdmins = (res.data.admins || []).filter(
        (admin) => admin.status === "rejected"
      );
      setAdmins(rejectedAdmins);
    } catch (err) {
      toast.error("Failed to fetch rejected admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Pagination
  const totalPages = Math.ceil(admins.length / pageSize);
  const indexOfLastAdmin = currentPage * pageSize;
  const indexOfFirstAdmin = indexOfLastAdmin - pageSize;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  return (
    <DashboardLayout activeMenu="Rejected">
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-sky-50 px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-700 flex items-center gap-2">
              <Ban size={24} className="text-red-500" />
              Rejected Admins
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium shadow-sm">
                Total Rejected: {admins.length}
              </span>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
            <p className="text-center text-gray-500">
              Loading rejected admins…
            </p>
          ) : admins.length === 0 ? (
            <p className="text-center text-gray-500">
              No rejected admins found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAdmins.map((admin, index) => (
                <motion.div
                  key={admin._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white border border-cyan-200 rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition-all"
                >
                  {/* Admin Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-red-600">
                      {indexOfFirstAdmin + index + 1}. {admin.name}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
                      {admin.email}
                    </p>
                    <p className="text-sm text-cyan-600 font-medium">
                      Role: {admin.role}
                    </p>
                    <p className="mt-1 font-semibold text-red-500">
                      Status: {admin.status}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    disabled
                    className="mt-4 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 text-white text-sm font-medium shadow cursor-not-allowed"
                  >
                    Rejected
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center sm:justify-end mt-6 gap-2 flex-wrap">
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

export default RejectedAdmins;
