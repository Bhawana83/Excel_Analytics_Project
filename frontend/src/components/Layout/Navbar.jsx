import { Menu, X, LogOut } from "lucide-react";
import { useState, useContext } from "react";
import Sidemenu from "./Sidemenu";
import { UserContext } from "../../Context/userContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearUser();
    toast.success("Logout Successfully!");
    navigate("/");
  };

  // take first letter of name
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex items-center justify-between  border-b border-gray-200/50 py-3 px-7 sticky top-0 z-30 backdrop-blur-sm shadow-sm">
      {/* Left side: toggle + logo */}
      <div className="flex items-center gap-4">
        <button
          className="block min-[1080px]:hidden text-black cursor-pointer"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <X className="text-2xl" />
          ) : (
            <Menu className="text-2xl" />
          )}
        </button>

        <h2 className="text-4xl font-bold text-sky-600 tracking-tight">
          Excel Analyzer
        </h2>
      </div>

      {/* Right side: user avatar with dropdown */}
      <div className="relative group">
        {/* Avatar Circle */}
        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-sky-700 text-white font-medium cursor-pointer select-none text-3xl">
          {initial}
        </div>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-20 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-red-50 rounded-t-lg transition"
          >
            <LogOut size={10} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Sidemenu */}
      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <Sidemenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
