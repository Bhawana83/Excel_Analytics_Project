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
      <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-white to-sky-200 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto space-y-10"
        >
          <h2 className="text-5xl font-extrabold text-center text-cyan-700 drop-shadow-sm">
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

// import { useState } from "react";
// import { motion } from "framer-motion";

// import { toast } from "react-toastify";
// import { useEffect } from "react";
// import { useContext } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";
// import DashboardLayout from "../components/Layout/DashboardLayout";
// import { UserContext } from "../Context/userContext";

// const SettingsPage = () => {
//   const [form, setForm] = useState({
//     // Form data
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(true); // Loading state
//   const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

//   const { updateUser } = useContext(UserContext); // 👈 get from your context

//   // ✨ Fetch the current user setting
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get(API_PATHS.SETTINGS.GET_ME);
//         setForm({
//           name: response.data.user.name,
//           email: response.data.user.email,
//           password: "",
//         });
//       } catch (error) {
//         toast.error("Failed to fetch settings.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle Update Profile
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axiosInstance.put(
//         API_PATHS.SETTINGS.UPDATE_PROFILE,
//         form
//       );
//       // 🔹 Update local state + localStorage so it persists
//       updateUser(res.data.user); // 👈 update context
//       setForm({ ...form, password: "" }); // Clear password field
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       toast.success("Profile updated successfully!");
//     } catch (error) {
//       toast.error("Failed to update profile...");
//       console.log("Error updating profile:", error.message);
//     }
//   };

//   // Handle Delete Account
//   const handleDeleteAccount = async () => {
//     if (!window.confirm("Are you sure you want to delete your account?"))
//       return;
//     try {
//       await axiosInstance.delete(API_PATHS.SETTINGS.DELETE_ACCOUNT);
//       localStorage.clear();
//       toast.success("Account deleted successfully!");
//       setTimeout(() => {
//         window.location.href = "/";
//       }, 1500);
//     } catch(error) {
//       console.log(error.message);
//       toast.error("Failed to delete account");
//     }
//   };

// return (
//   <DashboardLayout activeMenu="Settings">
//     <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-white to-sky-200 px-4 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="max-w-4xl mx-auto space-y-10"
//       >
//         <h2 className="text-5xl font-extrabold text-center text-cyan-700 drop-shadow-sm">
//           ⚙️ Settings
//         </h2>

//         {/* 👤 Profile Info */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-cyan-100 p-6 space-y-6">
//           <h3 className="text-xl font-semibold text-cyan-600 border-b pb-2">
//             👤 Profile Information
//           </h3>
//           <form onSubmit={handleUpdateProfile} className="space-y-4">
//             <input
//               type="text"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               className="w-full border border-cyan-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
//               placeholder="Full Name"
//             />
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               className="w-full border border-cyan-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
//               placeholder="Email Address"
//             />

//             <div>
//               <h3 className="text-lg font-semibold text-cyan-600 mb-2">
//                 🔐 Change Password
//               </h3>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={form.password}
//                   onChange={(e) =>
//                     setForm({ ...form, password: e.target.value })
//                   }
//                   className="w-full border border-cyan-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
//                   placeholder="New Password"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-2.5 text-gray-500 hover:text-cyan-500"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-300 to-sky-500 text-white font-medium shadow hover:from-cyan-500 hover:to-sky-700 transition"
//             >
//               {loading ? "Saving..." : "Update Profile"}
//             </button>
//           </form>
//         </div>

//         {/* ⚙️ Preferences */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-cyan-100 p-6">
//           <h3 className="text-xl font-semibold text-cyan-600 border-b pb-2 mb-4">
//             ⚙️ Preferences
//           </h3>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-700 font-medium">
//               Default Table Size
//             </span>
//             <select className="border border-cyan-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400">
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//             </select>
//           </div>
//         </div>

//         {/* ❌ Danger Zone */}
//         <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-cyan-400 p-6">
//           <h3 className="text-xl font-semibold text-rose-600 border-b pb-2 mb-4">
//             ❌ Danger Zone
//           </h3>
//           <button
//             className="w-full px-6 py-2 rounded-lg bg-cyan-600 text-white font-medium shadow hover:bg-cyan-400 transition"
//             onClick={handleDeleteAccount}
//           >
//             Delete Account
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   </DashboardLayout>
// );

// };

// export default SettingsPage;

//   // return (
// //   //   <DashboardLayout activeMenu="Settings">
// //   //     <div className="min-h-screen bg-gray-50 px-4 py-8">
// //   //       <motion.div
// //   //         initial={{ opacity: 0, y: 20 }}
// //   //         animate={{ opacity: 1, y: 0 }}
// //   //         transition={{ duration: 0.4 }}
// //   //         className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border p-6 space-y-10"
// //   //       >
// //   //         <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 text-center">
// //   //           ⚙️ Settings
// //   //         </h2>

// //   //         {/* 👤 Profile Info */}
// //   //         <div>
// //   //           <h3 className="text-xl font-semibold text-gray-800 mb-4">
// //   //             👤 Profile Information
// //   //           </h3>
// //   //           <form onSubmit={handleUpdateProfile} className="space-y-4">
// //   //             <input
// //   //               type="text"
// //   //               value={form.name}
// //   //               onChange={(e) => setForm({ ...form, name: e.target.value })}
// //   //               className="w-full border rounded-lg px-3 py-2"
// //   //               placeholder="Full Name"
// //   //             />
// //   //             <input
// //   //               type="email"
// //   //               value={form.email}
// //   //               onChange={(e) => setForm({ ...form, email: e.target.value })}
// //   //               className="w-full border rounded-lg px-3 py-2"
// //   //               placeholder="Email Address"
// //   //             />

// //   //             <div>
// //   //               <h3 className="text-xl font-semibold text-gray-800 mb-4">
// //   //                 🔐 Change Password
// //   //               </h3>
// //   //               <div className="space-y-4 relative">
// //   //                 <input
// //   //                   type={showPassword ? "text" : "password"}
// //   //                   value={form.password}
// //   //                   onChange={(e) =>
// //   //                     setForm({ ...form, password: e.target.value })
// //   //                   }
// //   //                   className="w-full border rounded-lg px-3 py-2"
// //   //                   placeholder="New Password"
// //   //                 />

// //   //                 <a
// //   //                   className="absolute right-3 top-2.5 cursor-pointer decoration-0"
// //   //                   onClick={() => setShowPassword(!showPassword)}
// //   //                 >
// //   //                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// //   //                 </a>
// //   //               </div>
// //   //             </div>

// //   //             <button
// //   //               type="submit"
// //   //               className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer "
// //   //             >
// //   //               {loading ? "Saving..." : "Update Profile"}
// //   //             </button>
// //   //           </form>
// //   //         </div>

// //   //         {/* ⚙️ Preferences */}
// //   //         <div>
// //   //           <h3 className="text-xl font-semibold text-gray-800 mb-4">
// //   //             ⚙️ Preferences
// //   //           </h3>
// //   //           <div className="space-y-4">
// //   //             <div className="flex items-center justify-between">
// //   //               <span className="text-gray-700 font-medium">
// //   //                 Default Table Size
// //   //               </span>
// //   //               <select
// //   //                 // value={}
// //   //                 // onChange={(e) => setTableSize(Number(e.target.value))}
// //   //                 className="border rounded px-3 py-2"
// //   //               >
// //   //                 <option value={10}>10</option>
// //   //                 <option value={20}>20</option>
// //   //                 <option value={50}>50</option>
// //   //               </select>
// //   //             </div>
// //   //           </div>
// //   //         </div>

// //   //         {/* ❌ Danger Zone */}
// //   //         <div>
// //   //           <h3 className="text-xl font-semibold text-red-600 mb-4">
// //   //             ❌ Danger Zone
// //   //           </h3>
// //   //           <button
// //   //             className="w-full px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
// //   //             onClick={handleDeleteAccount}
// //   //           >
// //   //             Delete Account
// //   //           </button>
// //   //         </div>
// //   //       </motion.div>
// //   //     </div>
// //   //   </DashboardLayout>
// //   // );
