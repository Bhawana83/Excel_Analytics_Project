import { useContext, useEffect, useState } from "react";
import {
  Home,
  Upload,
  Clock,
  Settings,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Database,
  ListOrdered,
  LineChart,
  BarChart3,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import { UserContext } from "../../Context/userContext";

// Submenus
const adminItems = [
  { name: "All Users", path: "/admin/users", icon: <Users size={16} /> },
  { name: "All Uploads", path: "/admin/uploads", icon: <Database size={16} /> },
  { name: "System Logs", path: "/admin/logs", icon: <ListOrdered size={16} /> },
];

const settingsItem = {
  name: "Settings",
  icon: <Settings size={18} />,
  path: "/settings",
};

const SideMenu = ({ activeMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [adminOpen, setAdminOpen] = useState(false);

  const handleClick = (route) => {
    navigate(route);
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200 p-5 sticky top-[61px] z-20 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
     

      {/* Menu Items */}
      <nav className="flex-1 px-2 py-1 space-y-1">
        {/* Dashboard */}
        <button
          className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
            activeMenu === "Dashboard" || location.pathname === "/dashboard"
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => handleClick("/dashboard")}
        >
          <Home size={18} />
          Dashboard
        </button>

        {/* Upload */}
        <button
          className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
            activeMenu === "Upload" || location.pathname === "/upload"
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => handleClick("/upload")}
        >
          <Upload size={18} />
          Upload
        </button>

        {/* History */}
        <button
          className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
            activeMenu === "History" || location.pathname === "/history"
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => handleClick("/history")}
        >
          <Clock size={18} />
          History
        </button>

        {/* 2D Charts */}
        <button
          className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
            location.pathname === "/charts/2d"
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => handleClick("/charts/2d")}
        >
          <LineChart size={18} />
          2D Charts
        </button>

        {/* 3D Charts */}
        <button
          className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
            location.pathname === "/charts/3d"
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => handleClick("/charts/3d")}
        >
          <BarChart3 size={18} />
          3D Charts
        </button>

        {/* Admin Dashboard Dropdown */}
        {user?.role === "admin" && (
          <div>
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="flex w-full items-center justify-between px-4 py-2 text-sm font-semibold rounded-lg text-slate-800 hover:bg-slate-100 transition"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} />
                Admin Dashboard
              </span>
              {adminOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                adminOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              {adminItems.map((sub) => (
                <button
                  key={sub.name}
                  className={`ml-8 mt-2 flex w-[85%] items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition hover:scale-[1.02] cursor-pointer ${
                    location.pathname === sub.path
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => handleClick(sub.path)}
                >
                  {sub.icon}
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <button
          className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
            activeMenu === "Settings" || location.pathname === "/settings"
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => handleClick(settingsItem.path)}
        >
          {settingsItem.icon}
          {settingsItem.name}
        </button>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <p className="text-[11px] text-slate-500 text-center">
          © {new Date().getFullYear()} Excellyzer
        </p>
      </div>
    </div>
  );
};

export default SideMenu;



