import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Loader2 } from "lucide-react";
import useGetUserUploads from "../hooks/useGetUserUploads";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import DashboardLayout from "../components/Layout/DashboardLayout";


export default function InsightsPage() {
  const [uploads, setUploads] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [insights, setInsights] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const { uploads: uploadFiles, loading } = useGetUserUploads();

  // ✅ Fetch upload history
  useEffect(() => {
    const fetchUploads = async () => {
      setLoadingUploads(true);
      try {
        const res = await axiosInstance.get(API_PATHS.UPLOAD.GET_HISTORY);
        setUploads(res.data.uploads || []);
      } catch (err) {
        console.error("Error fetching uploads", err);
      } finally {
        setLoadingUploads(false);
      }
    };
    fetchUploads();
  }, []);

  // ✅ Fetch AI Insights
  const handleGenerateInsights = async () => {
    if (!selectedId) return;
    setLoadingInsights(true);
    setInsights([]);
    try {
      const res = await axiosInstance.get(
        API_PATHS.UPLOAD.GET_INSIGHTS(selectedId)
      );
      setInsights(res.data.insights || []);
    } catch (err) {
      console.error("Error generating insights", err);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Insights">
      <div className="p-4 sm:p-6 md:p-10 max-w-screen-xl mx-auto min-h-screen">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lightbulb className="text-yellow-500" size={28} />
          AI-Powered Insights
        </motion.h2>
        {/* Card Container */}
        <motion.div
          className="bg-white shadow-xl border rounded-xl p-4 sm:p-6 md:p-8 space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Select File */}
          <div>
            <label className="block font-medium mb-2 text-sm sm:text-base">
              Select Upload File
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose File --</option>
              {loading ? (
                <option disabled>Loading uploads...</option>
              ) : (
                uploads.map((file) => (
                  <option key={file._id} value={file._id}>
                    {file.originalName}
                  </option>
                ))
              )}
            </select>
          </div>
          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateInsights}
              disabled={!selectedId || loadingInsights}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingInsights && (
                <Loader2 className="animate-spin" size={18} />
              )}
              Generate Insights
            </button>
          </div>
          {/* Insights Section */}
          
          {insights.length > 0 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
            
            <p> {insights[0]}</p>
              <h3 className="text-lg font-semibold text-gray-800">
                Key Findings:
              </h3>
              <ol className="list-decimal pl-5 space-y-3">
                {insights.slice(1).map((point, idx) => {
                  // Extract heading & description from AI string
                  const match = point.match(/\*\*(.*?)\*\*:?\s*(.*)/);
                  const heading = match ? match[1] : "";
                  const desc = match ? match[2] : point;

                  return (
                    <motion.li
                      key={idx}
                      className="text-gray-700 text-sm sm:text-base"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {heading && (
                        <span className="font-bold text-gray-900">
                          {heading}:
                        </span>
                      )}{" "}
                      {desc}
                    </motion.li>
                  );
                })}
              </ol>
            </motion.div>
          )}

          {/*  {insights.length > 0 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-lg font-semibold text-gray-800">Key Findings:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {insights.map((point, idx) => (
                  <motion.li
                    key={idx}
                    className="text-gray-700 text-sm sm:text-base"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {point}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )} */}
          {/* No Insights Message */}
          {!loadingInsights && insights.length === 0 && selectedId && (
            <p className="text-gray-500 text-center text-sm">
              No insights generated yet. Click <b>Generate Insights</b>.
            </p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

// import React, { useState } from "react";
// import DashboardLayout from "../../components/Layouts/DashboardLayout";
// import useGetUserUploads from "../../hooks/useGetUserUploads";
// import useParsedUploadData from "../../hooks/useParsedUploadData";

// const Insights = () => {
//   const [selectedUploadId, setSelectedUploadId] = useState("");

//   const { uploads: uploadFiles, loading: loadingUploads } = useGetUserUploads();
//   const { columns, rows, error } = useParsedUploadData(selectedUploadId);

//   return (
//     <DashboardLayout activeMenu="Insights">
//       <div className="p-4 sm:p-6 md:p-10 mx-auto max-w-screen-xl min-h-screen">
//         <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">
//           Insigths
//         </h2>

//         <div className="bg-white shadow-xl border rounded-xl p-4 sm:p-6 md:p-8 space-y-6 min-h-fit flex flex-col">
//           {/* Upload File Dropdown */}
//           <div className="flex-shrink-0">
//             <label className="block font-medium mb-2 text-sm sm:text-base">
//               Select Upload File
//             </label>
//             <select
//               value={selectedUploadId}
//               onChange={(e) => {
//                 setSelectedUploadId(e.target.value);
//                 setXAxis("");
//                 setYAxis("");
//               }}
//               className="w-full border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             >
//               <option value="">-- Choose File --</option>
//               {loadingUploads ? (
//                 <option disabled>Loading uploads...</option>
//               ) : (
//                 uploadFiles.map((file) => (
//                   <option key={file._id} value={file._id}>
//                     {file.originalName}
//                   </option>
//                 ))
//               )}
//             </select>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Insights;
