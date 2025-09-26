import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

import { toast } from "react-toastify";
import { UserContext } from "../context/userContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { LockIcon } from "lucide-react";
//import { ReactComponent as LockIcon } from "../assets/";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setLoggedin } = useContext(AppContent);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  //context api for authentication
  const { updateUser } = useContext(UserContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email cannot be empty");
      return;
    }
    if (!password) {
      setError("Password cannot be empty");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    // LOGIN API CALL
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token); // Store token in local storage
        localStorage.setItem("user", JSON.stringify(user)); // Store token in local storage
        updateUser(user); // Update user context

        // Role-based redirect
        if (user.role === "super-admin") {
          toast.success("Welcome Super Admin!");
          navigate("/super-admin/dashboard");
        } else {
          toast.success("Login successfully!");
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-cyan-200 to-sky-300">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full sm:w-96 text-teal-900 text-sm">
        <h2 className="text-3xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-sky-700">
          Login
        </h2>

        <p className="text-center text-sm mb-6">Login to your account</p>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-inner">
            <img src={assets.mail_icon} alt="email icon"  className="w-5 h-5 filter invert brightness-0"/>

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none w-full text-black placeholder-black"
              type="email"
              placeholder="Email Id"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-inner">
            <LockIcon className="w-5 h-5 text-white fill-current " />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none w-full text-black placeholder-black"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm pb-2.5">{error}</p>}

          <button className="w-full py-2.5 rounded-full bg-sky-600 text-white font-medium cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300">
            Login
          </button>

          <p className="text-center text-sm mt-4 text-slate-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-sky-600 cursor-pointer underline"
            >
              Sign Up.
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
