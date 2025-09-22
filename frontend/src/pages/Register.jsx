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
  const [role, setRole] = useState("user"); // NEW ROLE FIELD
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

     // SIGN UP API CALL
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        name,
        email,
        password,
        role,
      });

      const { token, user } = response.data;

      // Change Admin Pending flow
      if (user.role === "admin" && user.status === "pending") {
        // keep the id so AdminPending can poll if page reloads
        localStorage.setItem("pendingAdminId", user.id);
        toast.success("Admin request sent. Waiting for approval…");
        navigate("/admin-pending");
        return;
      }

      // Normal user register
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); // Store token in local storage
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

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        name,
        email,
        password,
        role, // SEND ROLE TO API
      });

      const { token, userr } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userr));
        updateUser(userr);
        toast.success("Sign Up successfully!!");
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
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-r/srgb from-cyan-300 to-sky-500">
      <div className="bg-transparent p-10 rounded-lg shadow-2xl w-full sm:w-96 text-white text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Create Account
        </h2>

        <p className="text-center text-sm mb-6">Create Your Account</p>

        <form onSubmit={onSubmitHandler}>
          {/* Name Input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#1294e0]">
            <img src={assets.person_icon} alt="" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="bg-transparent outline-none w-full "
              type="text"
              placeholder="Full Name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#1294e0]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none w-full"
              type="email"
              placeholder="Email Id"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#1294e0]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none w-full text-white"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {/* Role Selection (NEW) */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#1294e0]">
            <img src={assets.person_icon} alt="" />
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
          <button className="w-full py-2.5 rounded-full bg-[#0670ad] text-white font-medium cursor-pointer hover:from-cyan-600 hover:to-sky-800 hover:scale-105 hover:shadow-lg transition-all duration-300">
            Sign Up
          </button>

          {/* Redirect to Login */}
          <p className="text-white text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-900 cursor-pointer underline"
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





// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";
// import { toast } from "react-toastify";
// // import axios from "axios";
// import { UserContext } from "../context/userContext";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";


// const Register = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const { updateUser } = useContext(UserContext);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     if (!name) {
//       toast.error("Name is required");
//       return;
//     }
//     if (!password) {
//       toast.error("Please Enter the password");
//       return;
//     }
//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//       return;
//     }

//     setError("");

//     try {
//       const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
//         name,
//         email,
//         password,
//       });

//       console.log(response);
//       const { token, userr } = response.data;
//       if (token) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(userr));
//         updateUser(userr);
//         toast.success("Sign Up successfully!!");
//         navigate("/");
//       }
//     } catch (error) {
//       if (error.response && error.response.data.message) {
//         setError(error.response.data.message);
//       } else {
//         setError("Something went wrong, Please try again later");
//       }
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-r/srgb from-indigo-400 to-teal-400">
//       <div className="bg-transparent p-10 rounded-lg shadow-2xl w-full sm:w-96 text-white text-sm ">
//         <h2 className="text-3xl font-semibold text-white text-center mb-3">
//           Create Account
//         </h2>

//         <p className="text-center text-sm mb-6">Create Your Account</p>

//         <form onSubmit={onSubmitHandler}>
//           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#196c9c]">
//             <img src={assets.person_icon} alt="" />
//             <input
//               onChange={(e) => setName(e.target.value)} //stores the data through setName in the value variable 'name'
//               value={name}
//               className="bg-transparent outline-none"
//               type="text"
//               placeholder="Full Name"
//               required
//             />
//           </div>

//           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#196c9c]">
//             <img src={assets.mail_icon} alt="" />
//             <input
//               onChange={(e) => setEmail(e.target.value)} //stores the data through setName in the value variable 'name'
//               value={email}
//               className="bg-transparent outline-none"
//               type="email"
//               placeholder="Email Id"
//               required
//             />
//           </div>

//           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#196c9c]">
//             <img src={assets.lock_icon} alt="" />
//             <input
//               onChange={(e) => setPassword(e.target.value)} //stores the data through setName in the value variable 'name'
//               value={password}
//               className="bg-transparent outline-none"
//               type="password"
//               placeholder="Password"
//               required
//             />
//           </div>

//           {error && <p className="text-red-600 text-sm pb-2.5">{error}</p>}

//           <button className="w-full py-2.5 rounded-full bg-[#174e6e] text-white font-medium cursor-pointer hover:from-indigo-600 hover:to-indigo-800 hover:scale-105 hover:shadow-lg transition-all duration-300">
//             Sign Up
//           </button>

//           <p className="text-white text-center text-xs mt-4">
//             Already have an account? {"   "}
//             <span
//               onClick={() => navigate("/login")}
//               className="text-blue-900 cursor-pointer underline"
//             >
//               {" "}
//               Login here.
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;
