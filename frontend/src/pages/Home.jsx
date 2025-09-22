import { FileStack, FolderOpen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { useUserAuth } from "../hooks/useUserAuth";

import RecentUploads from "./RecentUploads";
import UploadsOverview from "./UploadsOverview";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

// Redesigned InfoCard with toned-down colors & better contrast
const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 max-sm:p-4 shadow-md cursor-pointer
      bg-gradient-to-br ${color} text-gray-900 group transition transform hover:scale-[1.02]`}
    >
      {/* Decorative subtle overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition" />
      <div className="flex items-center gap-4 relative z-10">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-xl 
          bg-white/40 backdrop-blur-sm text-gray-800 shadow-sm"
        >
          {icon}
        </div>
        <div>
          <h6 className="text-sm font-medium text-gray-700">{label}</h6>
          <p className="text-2xl font-bold text-gray-900">
            {value} {value >= 2 ? "Files" : "File"}
          </p>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  useUserAuth(); // For Authentication Checking

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Error in Home Component:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-6 mx-auto px-3">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<FileStack size={26} />}
            label="Total Uploads"
            value={dashboardData?.totalUploads || 0}
            color="from-cyan-200 to-teal-400"
          />
          <InfoCard
            icon={<FolderOpen size={26} />}
            label="Current Uploads"
            value={dashboardData?.currentUploads || 0}
            color="from-cyan-200 to-teal-400"
          />
          <InfoCard
            icon={<Trash2 size={26} />}
            label="Deleted Uploads"
            value={dashboardData?.deleteUploads || 0}
            color="from-cyan-200 to-teal-400"
          />
        </div>

        {/* Content Section */}
        {!dashboardData ? (
          <div className="text-center text-gray-500 py-10">
            Loading Dashboard...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <RecentUploads
              uploads={dashboardData.recentUploads}
              onSeeMore={() => navigate("/history")}
              buttonStyle="bg-gray-800 text-white hover:bg-gray-900"
            />

            <UploadsOverview
              totalUploads={dashboardData.totalUploads}
              currentUploads={dashboardData.currentUploads}
              deleteUploads={dashboardData.deleteUploads}
              buttonStyle="bg-gray-800 text-white hover:bg-gray-900"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;


















// import { FileStack, FolderOpen, Trash2 } from "lucide-react"; 
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import DashboardLayout from "../components/Layout/DashboardLayout";
// import { useUserAuth } from "../hooks/useUserAuth";

// import RecentUploads from "./RecentUploads";
// import UploadsOverview from "./UploadsOverview";
// import { API_PATHS } from "../utils/apiPaths";
// import axiosInstance from "../utils/axiosInstance";

// // New fancy InfoCard component (cyan + blue glassmorphic design)
// const InfoCard = ({ icon, label, value, color }) => {
//   return (
//     <div
//       className={`relative overflow-hidden rounded-2xl p-6 max-sm:p-4 shadow-lg cursor-pointer 
//       bg-gradient-to-br ${color} text-white group transition transform hover:scale-[1.03]`}
//     >
//       {/* Decorative blur circle */}
//       <div className="absolute top-0 right-0 w-28 h-28 bg-white/20 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition" />
//       <div className="flex items-center gap-4 relative z-10">
//         <div
//           className="flex items-center justify-center w-14 h-14 rounded-xl 
//           bg-white/20 backdrop-blur-md text-white shadow-md"
//         >
//           {icon}
//         </div>
//         <div>
//           <h6 className="text-sm font-medium opacity-80">{label}</h6>
//           <p className="text-2xl font-bold">
//             {value} {value >= 2 ? "Files" : "File"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Home = () => {
//   useUserAuth(); // For Authentication Checking

//   const navigate = useNavigate();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch Dashboard Data
//   const fetchDashboardData = async () => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
//       if (response.data) {
//         setDashboardData(response.data);
//       }
//     } catch (error) {
//       console.log(
//         "Something went wrong in Home Component, please try again : ",
//         error
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   return (
//     <DashboardLayout activeMenu="Dashboard">
//       <div className="my-6 mx-auto px-3">
//         {/* Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <InfoCard
//             icon={<FileStack size={26} />}
//             label="Total Uploads"
//             value={dashboardData?.totalUploads || 0}
//             color="from-cyan-400 to-teal-600"
//           />
//           <InfoCard
//             icon={<FolderOpen size={26} />}
//             label="Current Uploads"
//             value={dashboardData?.currentUploads || 0}
//             color="from-cyan-400 to-teal-600"
//           />
//           <InfoCard
//             icon={<Trash2 size={26} />}
//             label="Deleted Uploads"
//             value={dashboardData?.deleteUploads || 0}
//             color="from-cyan-400 to-teal-600"
//           />
//         </div>

//         {/* Content Section */}
//         {!dashboardData ? (
//           <div className="text-center text-gray-500 py-10">
//             Loading Dashboard...
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//             <RecentUploads
//               uploads={dashboardData.recentUploads}
//               onSeeMore={() => navigate("/history")}
//             />

//             <UploadsOverview
//               totalUploads={dashboardData.totalUploads}
//               currentUploads={dashboardData.currentUploads}
//               deleteUploads={dashboardData.deleteUploads}
//             />
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Home;
