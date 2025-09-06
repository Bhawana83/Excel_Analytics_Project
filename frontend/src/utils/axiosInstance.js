import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 👈 Add this here
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor - Interceptor ka matlab: jab bhi request bhejna ho, usse pehle kuch karna ho (jaise token add karna).

axiosInstance.interceptors.request.use(
  (config) => {
    // Axios har request ka config object deta hai (isme URL, headers, method, data sab hota hai).Hum usko modify kar sakte hain, jaise headers add karna.
    const accessToken = localStorage.getItem("token");
    // console.log(accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Token milne par headers me authorization lg dete hai
    }
    // console.log(`config: ${JSON.stringify(config)}`);
    return config; // Modified config wapas return karna zaroori hai warna request ruk jaayegi.
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
