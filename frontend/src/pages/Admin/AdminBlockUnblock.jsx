// AdminBlockUnblock.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const AdminBlockUnblock = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 🔹 Filter
  const [filter, setFilter] = useState("all"); // all | blocked | unblocked

  // Format date → dd MMM yyyy
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_USERS);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Block/Unblock
  const toggleBlock = async (userId) => {
    try {
      const res = await axiosInstance.patch(
        API_PATHS.ADMIN.TOGGLE_BLOCK_USER(userId)
      );
      if (res.data.success) {
        toast.dismiss();
        if (res.data.user.isBlocked) {
          toast.success("🚫 User blocked successfully!");
        } else {
          toast.success("✅ User unblocked successfully!");
        }
        fetchUsers();
      }
    } catch (err) {
      console.error("Error toggling block:", err);
      toast.error("Failed to update user status.");
    }
  };

  // Apply filter
  const filteredUsers = users.filter((user) => {
    if (filter === "blocked") return user.isBlocked === true;
    if (filter === "unblocked") return user.isBlocked === false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Dynamic title for count
  const getCountTitle = () => {
    if (filter === "blocked") return `Total Blocked: ${filteredUsers.length}`;
    if (filter === "unblocked")
      return `Total Unblocked: ${filteredUsers.length}`;
    return `Total Users: ${filteredUsers.length}`;
  };

  return (
    <DashboardLayout activeMenu="Block/Unblock User">
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-3 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-cyan-100 p-4 sm:p-6"
        >
          {/* 🔹 Header with Filter + Count */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              🚫 Block / Unblock Users
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-medium shadow-sm">
                {getCountTitle()}
              </span>

              {/* Filter Dropdown */}
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
              >
                <option value="all">All Users</option>
                <option value="blocked">Blocked</option>
                <option value="unblocked">Unblocked</option>
              </select>

              {/* Page Size Selector */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading users…</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
          ) : (
            <>
              {/* Table for larger screens */}
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
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-cyan-50 transition"
                      >
                        <td className="px-4 py-3 text-center text-gray-600">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.role}</td>
                        <td
                          className={`px-4 py-3 font-semibold ${
                            user.status === "active"
                              ? "text-cyan-600"
                              : user.status === "pending"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {user.status}
                        </td>
                        <td className="text-center">
                          {user.isBlocked ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3">{formatDate(user.updatedAt)}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleBlock(user._id)}
                            className={`px-3 py-1.5 rounded-lg text-white shadow-md transition ${
                              user.isBlocked
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                            }`}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-4">
                {currentUsers.map((user, index) => (
                  <div
                    key={user._id}
                    className="p-4 bg-gradient-to-r from-white to-cyan-50 rounded-xl border border-cyan-100 shadow hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-cyan-700">
                        {user.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        #{startIndex + index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Role:</span> {user.role}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        user.status === "active"
                          ? "text-cyan-600"
                          : user.status === "pending"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {user.status}
                    </p>
                    <p className="text-sm mt-1">
                      Blocked:{" "}
                      {user.isBlocked ? (
                        <span className="text-blue-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-cyan-600 font-semibold">No</span>
                      )}
                    </p>
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={() => toggleBlock(user._id)}
                        className={`px-3 py-1.5 rounded-md text-white text-sm shadow-md transition ${
                          user.isBlocked
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        }`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
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

export default AdminBlockUnblock;
