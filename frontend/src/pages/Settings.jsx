import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { UserContext } from "../Context/userContext";

const SettingsPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.SETTINGS.GET_ME);
        setForm({
          name: response.data.user.name,
          email: response.data.user.email,
          password: "",
        });
      } catch (error) {
        toast.error("Failed to fetch settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        API_PATHS.SETTINGS.UPDATE_PROFILE,
        form
      );
      updateUser(res.data.user);
      setForm({ ...form, password: "" });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile...");
      console.log("Error updating profile:", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await axiosInstance.delete(API_PATHS.SETTINGS.DELETE_ACCOUNT);
      localStorage.clear();
      toast.success("Account deleted successfully!");
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (error) {
      toast.error("Failed to delete account");
      console.log(error.message);
    }
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="min-h-screen bg-gradient-to-br from-sky-200 via-white to-sky-200 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto space-y-10"
        >
          <h2 className="text-5xl font-extrabold text-center text-sky-700 drop-shadow-sm">
            Settings
          </h2>

          {/* Grid Layout for Profile & Preferences */}
          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
            {/* 👤 Profile Info */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-cyan-100 p-6 flex flex-col">
              <h3 className="text-xl font-semibold text-cyan-600 border-b pb-2 mb-4">
                👤 Profile Information
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4 flex-1">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full border border-cyan-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email Address"
                  className="w-full border border-cyan-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                />

                <div>
                  <h3 className="text-lg font-semibold text-cyan-600 mb-2">
                    🔐 Change Password
                  </h3>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="New Password"
                      className="w-full border border-cyan-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-cyan-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-300 to-sky-500 text-white font-medium shadow hover:from-cyan-500 hover:to-sky-700 transition mt-2"
                >
                  {loading ? "Saving..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>

          {/* ❌ Danger Zone */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-cyan-400 p-6 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-rose-600 border-b pb-2 mb-4">
              ❌ Danger Zone
            </h3>
            <button
              className="w-full px-6 py-2 rounded-lg bg-cyan-600 text-white font-medium shadow hover:bg-cyan-400 transition"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

