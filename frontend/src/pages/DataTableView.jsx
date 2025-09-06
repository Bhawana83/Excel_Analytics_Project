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
      <div className="p-4 sm:p-6 md:p-10 mx-auto max-w-screen-xl min-h-screen">
        {/* 🟢 Page Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">
          📑 Data Table Viewer
        </h2>

        {/* 🟢 File Selection */}
        <div className="bg-white shadow-xl border rounded-xl p-4 sm:p-6 space-y-6">
          <div>
            <label className="block font-medium mb-2 text-sm sm:text-base">
              Select Upload File
            </label>
            <select
              value={selectedUploadId}
              onChange={(e) => setSelectedUploadId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
          {error && (
            <p className="text-red-500 text-sm">
              ❌ {error}
            </p>
          )}

          {/* 🟢 Table Display */}
          {columns.length > 0 && rows.length > 0 && (
            <motion.div
              key={selectedUploadId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-x-auto"
            >
              <table className="min-w-full border border-gray-200 text-sm sm:text-base">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left font-semibold border-b border-indigo-700"
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-indigo-50 transition"
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-2 border-b border-gray-200"
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
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
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
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
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
