import { useContext } from "react";
import Navbar from "./Navbar";
import Sidemenu from "./Sidemenu";
import { UserContext } from "../../context/userContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);  


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Layout Content */}
      {user && (
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="max-[1080px]:hidden text-black shadow-lg">
            <Sidemenu activeMenu={activeMenu} />
          </div>

          {/* Main Content */}
          <div
            className="grow mx-5 my-6 p-6 rounded-2xl 
            bg-white shadow-md shadow-sky-200 border border-sky-200"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;