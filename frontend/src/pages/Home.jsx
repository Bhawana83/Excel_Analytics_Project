/* 1) homepage first time open page hai aur home woh page hai jo login ha register krne ke baad open hoga hena 

2) Esme import krenge DashboardLayout ko

3) Jaise Hee user login ha register krta hai hume usko Home.jsx par bhej dena hai aru route hoga 
/dashboard - esko implement kr rhe ab
*/


import { FileStack } from "lucide-react"; // Total Uploads
import { FolderOpen } from "lucide-react"; // Current Uploads
import { Trash2 } from "lucide-react"; // Deleted Uploads
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { useUserAuth } from "../hooks/useUserAuth";

import RecentUploads from "./RecentUploads";
import UploadsOverview from "./UploadsOverview";
import InfoCard from "../components/Cards/InfoCard";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const Home = () => {
  useUserAuth(); // For Authentication Checking

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    // yhan tuje kuch changes krne padenge jaise
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log(
        "Something went wrong in Home Component, please try again : ",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <InfoCard
            icon={<FileStack />}
            label="Total Uploads"
            value={dashboardData?.totalUploads || 0}
            color="bg-blue-500"
          />
          <InfoCard
            icon={<FolderOpen />}
            label="Current Uploads"
            value={dashboardData?.currentUploads || 0}
            color="bg-green-500"
          />
          <InfoCard
            icon={<Trash2 />}
            label="Delete Uploads"
            value={dashboardData?.deleteUploads || 0}
            color="bg-orange-500"
          />
        </div>

        {!dashboardData ? (
          <div className="text-center text-gray-500 py-10">
            Loading Dashboard...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <RecentUploads
              uploads={dashboardData.recentUploads}
              onSeeMore={() => navigate("/history")}
            />

            <UploadsOverview
              totalUploads={dashboardData.totalUploads}
              currentUploads={dashboardData.currentUploads}
              deleteUploads={dashboardData.deleteUploads}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
