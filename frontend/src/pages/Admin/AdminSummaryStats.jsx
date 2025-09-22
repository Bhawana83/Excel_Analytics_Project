// AdminSummaryStats.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Icons
import { Users, UserX, FileSpreadsheet } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const AdminSummaryStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.ADMIN.SUMMARY_STATS);
      setStats(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      toast.error("Failed to load summary stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="w-10 h-10 text-cyan-100" />,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Blocked Users",
      value: stats?.blockedUsers || 0,
      icon: <UserX className="w-10 h-10 text-cyan-100" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Total Uploads",
      value: stats?.totalUploads || 0,
      icon: <FileSpreadsheet className="w-10 h-10 text-cyan-100" />,
      color: "from-cyan-600 to-blue-700",
    },
  ];

  return (
    <DashboardLayout activeMenu="Summary Stats">
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-700 mb-8 text-center">
            📊 Admin Summary Stats
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading stats…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center justify-between p-6 rounded-2xl shadow-lg bg-gradient-to-r ${card.color} text-white`}
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold drop-shadow-md">
                      {card.title}
                    </h3>
                    <p className="text-3xl sm:text-4xl font-bold mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div className="ml-4 bg-white/20 p-3 rounded-full shadow-md">
                    {card.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSummaryStats;

// // AdminSummaryStats.jsx
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";

// // Icons
// import { Users, UserX, FileSpreadsheet } from "lucide-react";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPaths";
// import DashboardLayout from "../../components/Layout/DashboardLayout";

// const AdminSummaryStats = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(API_PATHS.ADMIN.SUMMARY_STATS);
//       setStats(res.data);
//       console.log(res.data);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       toast.error("Failed to load summary stats");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const cards = [
//     {
//       title: "Total Users",
//       value: stats?.totalUsers || 0,
//       icon: <Users className="w-10 h-10 text-indigo-600" />,
//       color: "from-indigo-500 to-indigo-700",
//     },
//     {
//       title: "Blocked Users",
//       value: stats?.blockedUsers || 0,
//       icon: <UserX className="w-10 h-10 text-red-600" />,
//       color: "from-red-500 to-red-700",
//     },
//     {
//       title: "Total Uploads",
//       value: stats?.totalUploads || 0,
//       icon: <FileSpreadsheet className="w-10 h-10 text-green-600" />,
//       color: "from-green-500 to-green-700",
//     },
//   ];

//   return (
//     <DashboardLayout activeMenu="Summary Stats">
//       <div className="min-h-screen bg-gray-50 px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="max-w-6xl mx-auto"
//         >
//           <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-8 text-center">
//             📊 Admin Summary Stats
//           </h2>

//           {loading ? (
//             <p className="text-center text-gray-500">Loading stats…</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {cards.map((card, idx) => (
//                 <motion.div
//                   key={idx}
//                   whileHover={{ scale: 1.05 }}
//                   className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-r ${card.color} text-white`}
//                 >
//                   <div>
//                     <h3 className="text-lg font-medium">{card.title}</h3>
//                     <p className="text-3xl font-bold mt-2">{card.value}</p>
//                   </div>
//                   {card.icon}
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default AdminSummaryStats;
