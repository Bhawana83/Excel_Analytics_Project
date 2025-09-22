import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const ApprovedAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.SUPER_ADMIN.GET_ALL_ADMINS);
      const approvedAdmins = (res.data.admins || []).filter(
        (admin) => admin.status === "active"
      );
      setAdmins(approvedAdmins);
    } catch (err) {
      toast.error("Failed to fetch approved admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const totalPages = Math.ceil(admins.length / pageSize);
  const indexOfLastAdmin = currentPage * pageSize;
  const indexOfFirstAdmin = indexOfLastAdmin - pageSize;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  return (
    <DashboardLayout activeMenu="Approved">
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-sky-50 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-700">
              ✅ Approved Admins
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-full text-sm font-medium shadow">
                Total Approved: {admins.length}
              </span>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-cyan-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-cyan-400 focus:border-transparent shadow-sm"
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
              Loading approved admins…
            </p>
          ) : admins.length === 0 ? (
            <p className="text-center text-gray-500">
              No approved admins found.
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
                    <h3 className="text-lg font-semibold text-cyan-700">
                      {indexOfFirstAdmin + index + 1}. {admin.name}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
                      {admin.email}
                    </p>
                    <p className="text-sm text-sky-600 font-medium">
                      Role: {admin.role}
                    </p>
                    <p className="mt-1 font-semibold text-green-600">
                      Status: {admin.status}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button className="mt-4 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-white text-sm font-medium shadow hover:opacity-90 transition">
                    Approve
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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

export default ApprovedAdmins;
