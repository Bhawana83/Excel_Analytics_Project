// DataTableView.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useGetUserUploads from "../hooks/useGetUserUploads";
import useParsedUploadData from "../hooks/useParsedUploadData";
import DashboardLayout from "../components/Layout/DashboardLayout";

const DataTableView = () => {
  // 🟢 State management
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 🟢 Fetch available files
  const { uploads: uploadFiles, loading: loadingUploads } = useGetUserUploads();

  // 🟢 Fetch data for the selected file
  const { columns, rows, error } = useParsedUploadData(selectedUploadId);

  // 🟢 Pagination calculations
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // 🟢 Reset page when file changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedUploadId, rowsPerPage]);

  return (
    <DashboardLayout activeMenu="Data Table View">
      <div className="p-4 sm:p-6 md:p-10 mx-auto max-w-screen-xl min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
        {/* 🟢 Page Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 mb-6 text-center">
          📑 Data Table Viewer
        </h2>

        {/* 🟢 File Selection + Table */}
        <div className="bg-white/90 backdrop-blur shadow-xl border border-cyan-100 rounded-2xl p-4 sm:p-6 space-y-6">
          {/* 🟢 File Selector */}
          <div>
            <label className="block font-medium mb-2 text-sm sm:text-base text-gray-700">
              Select Upload File
            </label>
            <select
              value={selectedUploadId}
              onChange={(e) => setSelectedUploadId(e.target.value)}
              className="w-full border border-cyan-200 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
            >
              <option value="">-- Choose File --</option>
              {loadingUploads ? (
                <option disabled>Loading uploads...</option>
              ) : (
                uploadFiles.map((file) => (
                  <option key={file._id} value={file._id}>
                    {file.originalName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* 🟢 Error Message */}
          {error && <p className="text-red-500 text-sm">❌ {error}</p>}

          {/* 🟢 Table Display */}
          {columns.length > 0 && rows.length > 0 && (
            <motion.div
              key={selectedUploadId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-x-auto rounded-2xl border border-cyan-200 bg-white shadow-lg"
            >
              <table className="min-w-full text-sm sm:text-base border-collapse">
                <thead className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white rounded-t-xl">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left font-semibold uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {paginatedRows.map((row, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`transition-transform transform hover:scale-[1.02] hover:bg-cyan-50 ${
                        idx % 2 === 0 ? "bg-cyan-50/20" : "bg-white"
                      }`}
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-5 py-3 border-b border-gray-200 rounded-lg"
                        >
                          {row[col] !== undefined && row[col] !== null
                            ? row[col].toString()
                            : ""}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* 🟢 No Data Message */}
          {selectedUploadId && rows.length === 0 && !error && (
            <p className="text-gray-500 text-sm">
              No data available for the selected file.
            </p>
          )}

          {/* 🟢 Pagination Controls */}
          {columns.length > 0 && rows.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              {/* Rows Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border border-cyan-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-4 py-1.5 rounded-lg font-medium transition ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500"
                  }`}
                >
                  ⬅ Prev
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-4 py-1.5 rounded-lg font-medium transition ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500"
                  }`}
                >
                  Next ➡
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataTableView;