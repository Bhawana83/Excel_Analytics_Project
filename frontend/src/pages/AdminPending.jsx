// src/pages/AdminPending.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../Context/userContext";

const TOTAL_SECONDS = 300; // 5 minutes

export default function AdminPending() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const [pendingId] = useState(
    () => localStorage.getItem("pendingAdminId") || ""
  );
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);

  const mmss = useMemo(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [timeLeft]);

  const progress = useMemo(
    () => ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100,
    [timeLeft]
  );

  useEffect(() => {
    if (!pendingId) {
      toast.dismiss();
      toast.error("Missing admin request id.");
      navigate("/");
      return;
    }

    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tick);
          clearInterval(poll);
          toast("Time expired. Please try later.", { icon: "⏱️" });
          navigate("/");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const poll = setInterval(async () => {
      try {
        const { data } = await axiosInstance.get(
          API_PATHS.ADMIN.STATUS(pendingId)
        );

        if (data?.status === "active") {
          clearInterval(poll);
          clearInterval(tick);
          localStorage.removeItem("pendingAdminId");

          const res = await axiosInstance.post(
            API_PATHS.AUTH.APPROVED_LOGIN(pendingId)
          );
          const { token, user } = res.data;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Approved! Redirecting…");
          updateUser(user);
          navigate("/dashboard");
        }

        if (data?.status === "rejected") {
          clearInterval(poll);
          clearInterval(tick);
          localStorage.removeItem("pendingAdminId");
          toast.error("Request rejected by Super-Admin.");
          navigate("/");
        }
      } catch (err) {
        console.warn("Status poll failed", err?.response?.data || err.message);
      }
    }, 2000);

    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [pendingId, navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl p-6 sm:p-10 bg-white/30 backdrop-blur-md border border-cyan-200 rounded-3xl shadow-xl flex flex-col items-center gap-6"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-200 text-cyan-800 text-2xl animate-pulse">
            ⏳
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-cyan-900">
            Waiting for Super-Admin Approval
          </h1>
        </div>

        <p className="text-cyan-800 text-center">
          Keep this page open. You’ll be auto-redirected once your admin request
          is approved.
        </p>

        {/* Countdown ring */}
        <div className="relative w-48 h-48">
          <motion.div
            style={{
              background: `conic-gradient(#06b6d4 ${progress}%, #e0f2fe 0)`,
            }}
            className="rounded-full w-full h-full grid place-items-center shadow-lg"
          >
            <div className="bg-white/90 backdrop-blur-md w-36 h-36 rounded-full grid place-items-center shadow-inner">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mmss}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl sm:text-4xl font-mono font-bold text-cyan-900"
                >
                  {mmss}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs text-cyan-700 mt-1 tracking-wider uppercase">
                Time Left
              </div>
            </div>
          </motion.div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl border border-cyan-300 text-cyan-900 font-medium hover:bg-cyan-100 transition"
          >
            Go Home
          </button>
          <button
            onClick={async () => {
              try {
                const { data } = await axiosInstance.get(
                  API_PATHS.ADMIN.STATUS(pendingId)
                );
                toast.info(`Current status: ${data?.status || "unknown"}`);
              } catch (error) {
                toast.error("Unable to fetch status");
              }
            }}
            className="w-full py-3 rounded-xl bg-cyan-500 text-white font-medium shadow hover:bg-cyan-600 transition"
          >
            Check Now
          </button>
        </div>

        <p className="text-xs text-cyan-700 text-center mt-4">
          If time runs out, you’ll be redirected to the homepage. You can still
          log in later—if approved, your admin access will work automatically.
        </p>
      </motion.div>
    </div>
  );
}