import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (!password) {
      toast.error("Please Enter the password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        name,
        email,
        password,
        role,
      });

      const { token, user } = response.data;

      if (user.role === "admin" && user.status === "pending") {
        localStorage.setItem("pendingAdminId", user.id);
        toast.success("Admin request sent. Waiting for approval…");
        navigate("/admin-pending");
        return;
      }

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        updateUser(user);
        toast.success("Sign Up successfully!");
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-cyan-200 to-sky-300">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full sm:w-96 text-teal-900 text-sm">
        <h2 className="text-3xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-sky-700">
          Create Account
        </h2>

        <p className="text-center text-sm mb-6">Create your account</p>

        <form onSubmit={onSubmitHandler}>
          {/* Name Input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-inner">
            <img src={assets.person_icon} alt="person icon" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="bg-transparent outline-none w-full text-white placeholder-white"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-inner">
            <img src={assets.mail_icon} alt="email icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none w-full text-white placeholder-white"
              type="email"
              placeholder="Email Id"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-inner">
            <img src={assets.lock_icon} alt="lock icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none w-full text-white placeholder-white"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-inner">
            <img src={assets.person_icon} alt="role icon" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent outline-none w-full text-white"
            >
              <option value="user" className="text-black">
                User
              </option>
              <option value="admin" className="text-black">
                Admin
              </option>
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm pb-2.5">{error}</p>}

          {/* Submit Button */}
          <button className="w-full py-2.5 rounded-full bg-sky-600 text-white font-medium cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300">
            Sign Up
          </button>

          {/* Redirect to Login */}
          <p className="text-center text-sm mt-4 text-slate-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-sky-600 cursor-pointer underline"
            >
              Login here.
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
