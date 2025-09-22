import { useContext, useEffect, useState } from "react";
import {
  Home,
  Upload,
  Clock,
  BarChart2,
  Settings,
  Users,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Database,
  ListOrdered,
  LayoutDashboard,
  LineChart,
  BarChart3,
  Table,
  Grid,
  CheckCircle2,
  XCircle,
  Hourglass,
  ShieldCheckIcon,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/userContext";

// Submenus
const adminItems = [
  { name: "All Users", path: "/admin/users", icon: <Users size={16} /> },
  {
    name: "Block/Unblock User",
    path: "/admin/toggleBlock",
    icon: <Database size={16} />,
  },
  {
    name: "Summary Stats",
    path: "/admin/summary",
    icon: <BarChart3 size={16} />,
  },
];

const visualizationItems = [
  { name: "2D Charts", path: "/charts/2d", icon: <LineChart size={16} /> },
  { name: "3D Charts", path: "/charts/3d", icon: <BarChart3 size={16} /> },
  {
    name: "Insights",
    path: "/charts/insights",
    icon: <LayoutDashboard size={16} />,
  },
  { name: "Data Table View", path: "/charts/table", icon: <Table size={16} /> },
];

const superAdminItems = [
  {
    name: "Dashboard",
    path: "/super-admin/dashboard",
    icon: <Grid size={16} />,
  },
  {
    name: "Users",
    path: "/super-admin/users",
    icon: <Users size={16} />,
  },
  {
    name: "Admins",
    path: "/super-admin/admins",
    icon: <ShieldCheckIcon size={16} />,
  },
  {
    name: "Pending",
    path: "/super-admin/pending",
    icon: <Hourglass size={16} />,
  },
  {
    name: "Approved",
    path: "/super-admin/approved",
    icon: <CheckCircle2 size={16} />,
  },
  {
    name: "Rejected",
    path: "/super-admin/rejected",
    icon: <XCircle size={16} />,
  },
];

const settingsItem = {
  name: "Settings",
  icon: <Settings size={18} />,
  path: "/settings",
};

const SideMenu = ({ activeMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useContext(UserContext);

  const isadminDashboardRoutes = [
    "/admin/users",
    "/admin/toggleBlock",
    "/admin/summary",
  ].includes(location.pathname);

  const [adminOpen, setAdminOpen] = useState(isadminDashboardRoutes);
  const isVisualizationRoute = [
    "/charts/2d",
    "/charts/3d",
    "/charts/insights",
    "/charts/table",
  ].includes(location.pathname);

  const [visualOpen, setVisualOpen] = useState(isVisualizationRoute);

  const handleClick = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    sessionStorage.setItem("manualLogout", "true"); // ✅ set logout flag

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingAdminId");
    // localStorage.clear()
    clearUser();
    toast.success("Logout Successfully!");
    navigate("/");
  };

  return (
    <div className="w-65 h-[calc(100vh-61px)] bg-cyan-500 border-r border-gray-200/50 p-5 sticky top-[61px] z-20 shadow-[0_2px_8px_rgba(0,0,0,0.05)]  border-r-2 border-gray-300">
      {/* Menu Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {user?.role === "super-admin" ? (
          // Only super-admin menu
          superAdminItems.map((item) => (
            <button
              key={item.name}
              className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
                activeMenu === item.name || location.pathname === item.path
                  ? "bg-cyan-600 text-white"
                  : "text-slate-700 hover:bg-cyan-100"
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.name}
            </button>
          ))
        ) : (
          <>
            {/* ✅ Existing user/admin menu (keep everything as it is) */}
            {/* Dashboard */}
            <button
              className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
                activeMenu === "Dashboard" || location.pathname === "/dashboard"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-700 hover:bg-cyan-100"
              }`}
              onClick={() => handleClick("/dashboard")}
            >
              <Home size={18} />
              Dashboard
            </button>

            {/* Admin Dashboard Dropdown */}
            {user?.role === "admin" && (
              <div>
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg text-slate-800 hover:bg-cyan-100 transition"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={18} />
                    <Link to="/admin/users">Admin Dashboard</Link>
                  </span>
                  {adminOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    adminOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {adminItems.map((sub) => (
                    <button
                      key={sub.name}
                      className={`ml-8 mt-2 flex w-[85%] items-center gap-2 px-3 py-3 rounded-md text-[13px] font-medium transition hover:scale-[1.02] cursor-pointer ${
                        location.pathname === sub.path
                          ? "bg-cyan-600 text-white"
                          : "text-slate-700 hover:bg-cyan-100"
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

            {/* Upload */}
            <button
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
                activeMenu === "Upload" || location.pathname === "/upload"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-700 hover:bg-cyan-100"
              }`}
              onClick={() => handleClick("/upload")}
            >
              <Upload size={18} />
              Upload
            </button>

            {/* History */}
            <button
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
                activeMenu === "History" || location.pathname === "/history"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-700 hover:bg-cyan-100"
              }`}
              onClick={() => handleClick("/history")}
            >
              <Clock size={18} />
              History
            </button>

            {/* Visualization Dropdown */}
            <div>
              <button
                onClick={() => setVisualOpen(!visualOpen)}
                className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg text-slate-800 hover:bg-cyan-100 transition`}
              >
                <span className="flex items-center gap-2">
                  <BarChart2 size={18} />
                  <Link to="/charts/2d">Visualizations</Link>
                </span>
                {visualOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  visualOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                {visualizationItems.map((sub) => (
                  <button
                    key={sub.name}
                    className={`ml-8 mt-2 flex w-[85%] items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition hover:scale-[1.02] cursor-pointer ${
                      location.pathname === sub.path
                        ? "bg-cyan-600 text-white"
                        : "text-slate-700 hover:bg-cyan-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // prevents outer dropdown from auto-closing
                      handleClick(sub.path);
                      setVisualOpen(true);
                    }}
                  >
                    {sub.icon}
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <button
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition hover:scale-105 cursor-pointer ${
                activeMenu === "Settings" || location.pathname === "/settings"
                  ? " bg-cyan-600 text-white"
                  : "text-slate-700 hover:bg-cyan-100"
              }`}
              onClick={() => handleClick(settingsItem.path)}
            >
              {settingsItem.icon}
              {settingsItem.name}
            </button>
          </>
        )}
      </nav>

      {/* Footer */}
      <p className="text-[11px] mt-auto  text-white sticky bottom-[61px]  text-center">
        © {new Date().getFullYear()} Excel Analyzer
      </p>
    </div>
  );
};

export default SideMenu;
