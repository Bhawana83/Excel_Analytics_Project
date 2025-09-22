import axios from "axios";
import { BASE_URL } from "./apiPaths";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔑 Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    // 🟢 Send token only if valid
    if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Response Interceptor for handling expired token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 🔁 Retry once if ECONNRESET
    if (error.code === "ECONNRESET" && !error.config._retry) {
      error.config._retry = true;
      return axiosInstance(error.config);
    }

    // 🚨 Handle Unauthorized (401)
    if (error.response?.status === 401) {
      const manualLogout = sessionStorage.getItem("manualLogout");

      if (manualLogout === "true") {
        // ✅ This was a manual logout → just ignore and reset flag
        sessionStorage.removeItem("manualLogout");
        return Promise.reject(error);
      }

      // 🚨 Otherwise, it's a real session expiry
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // ✅ Clear any old toasts & show new one
      toast.dismiss();
      toast.error("⚠️ Session expired, please login again!", {
        duration: 2500,
      });

      // ✅ Redirect after short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2500);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from "axios";
// import { BASE_URL } from "./apiPaths";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true, // 👈 Add this here
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Request Interceptor - Interceptor ka matlab: jab bhi request bhejna ho, usse pehle kuch karna ho (jaise token add karna).

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Axios har request ka config object deta hai (isme URL, headers, method, data sab hota hai).Hum usko modify kar sakte hain, jaise headers add karna.
//     const accessToken = localStorage.getItem("token");
//     // console.log(accessToken);
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`; // Token milne par headers me authorization lg dete hai
//     }
//     // console.log(`config: ${JSON.stringify(config)}`);
//     return config; // Modified config wapas return karna zaroori hai warna request ruk jaayegi.
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
