import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

import { toast } from "react-toastify";
import { UserContext } from "../context/userContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";



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
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, userr } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userr));
        updateUser(userr);
        toast.success("Login successfully!!");
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, Please try again later");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-r/srgb from-indigo-400 to-teal-400">
      <div className="bg-transparent p-10 rounded-lg shadow-2xl w-full sm:w-96 text-white text-sm ">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Login
        </h2>

        <p className="text-center text-sm mb-6">Login to your account!!</p>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#196c9c]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)} //stores the data through setName in the value variable 'name'
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email Id"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#196c9c]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)} //stores the data through setName in the value variable 'name'
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm pb-2.5">{error}</p>}

          <button className="w-full py-2.5 rounded-full bg-[#174e6e] text-white font-medium cursor-pointer hover:from-indigo-600 hover:to-indigo-800 hover:scale-105 hover:shadow-lg transition-all duration-300">
            Login
          </button>

          <p className="text-white text-center text-xs mt-4">
            Don't have an account? {"   "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-900 cursor-pointer underline"
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
