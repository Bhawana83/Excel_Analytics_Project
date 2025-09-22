// SuperAdminUserModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const SuperAdminUserModal = ({
  isOpen,
  onClose,
  onUserUpdated,
  mode = "add",
  user = null,
  userRole,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // add only
  const [role, setRole] = useState(userRole); // superadmin can change role
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const modalRef = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Prefill form when editing
  useEffect(() => {
    if (mode === "edit" && user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
      setPassword(""); // don’t prefill password
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole(userRole);
    }
  }, [mode, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || (mode === "add" && !password)) {
      toast.error("All required fields must be filled!");
      return;
    }

    try {
      setLoading(true);

      let res;
      if (mode === "add") {
        res = await axiosInstance.post(API_PATHS.SUPER_ADMIN.CREATE_USER, {
          name,
          email,
          password,
          role,
        });
      } else {
        res = await axiosInstance.put(
          API_PATHS.SUPER_ADMIN.UPDATE_USER(user._id),
          {
            name,
            email,
            role,
          }
        );
      }

      if (res.data.success) {
        toast.success(
          mode === "add"
            ? "User created successfully!"
            : "User updated successfully!"
        );
        onUserUpdated(); // refresh parent list
        onClose();
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error("Error in SuperAdminUserModal:", err);
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-gray-900/30 to-gray-950/20 backdrop-blur-sm px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-indigo-700 mb-4">
              {mode === "add" ? "➕ Add New User/Admin" : "✏️ Edit User/Admin"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Role (only in edit) */}
              {mode === "edit" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              {/* Password only in add */}
              {mode === "add" && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500 border-none outline-none cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 cursor-pointer text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading
                    ? mode === "add"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "add"
                    ? "Create"
                    : "Update"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuperAdminUserModal;
