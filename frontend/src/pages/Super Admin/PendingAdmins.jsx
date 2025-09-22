import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hourglass, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const PendingAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.SUPER_ADMIN.GET_ALL_ADMINS);
      const pendingAdmins = (res.data.admins || []).filter(
        (admin) => admin.status === "pending"
      );
      setAdmins(pendingAdmins);
    } catch {
      toast.error("Failed to fetch pending admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

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

  const totalPages = Math.ceil(admins.length / pageSize);
  const indexOfLastAdmin = currentPage * pageSize;
  const indexOfFirstAdmin = indexOfLastAdmin - pageSize;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  return (
    <DashboardLayout activeMenu="Pending">
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-cyan-700 flex items-center gap-2">
              <Hourglass size={28} className="text-yellow-500" />
              Pending Admins
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-medium shadow">
                Total Pending: {admins.length}
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

          {/* Admin Cards */}
          {loading ? (
            <p className="text-center text-gray-500">Loading pending admins…</p>
          ) : currentAdmins.length === 0 ? (
            <p className="text-center text-gray-500">
              No pending admins found.
            </p>
          ) : (
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {currentAdmins.map((admin, index) => (
                <motion.div
                  key={admin._id}
                  className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-lg flex flex-col justify-between hover:scale-105 transition-all"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {admin.name}
                    </h3>
                    <p className="text-sm text-slate-800 mb-1">{admin.email}</p>
                    <p className="text-sm text-cyan-600 font-medium">
                      {admin.role}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 rounded-full text-yellow-700 font-semibold text-xs bg-yellow-100">
                      {admin.status}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleApprove(admin._id)}
                      disabled={admin.status === "active"}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-medium shadow hover:opacity-90 transition disabled:opacity-50"
                    >
                      <Check size={16} className="inline mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(admin._id)}
                      disabled={admin.status === "rejected"}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow hover:opacity-90 transition disabled:opacity-50"
                    >
                      <X size={16} className="inline mr-1" /> Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center sm:justify-end mt-6 gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-sm ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PendingAdmins;
