// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login"; // simple default ko bina curly
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import History from "./pages/History";
import Settings from "./pages/Settings";

import { UserProvider } from "./context/userContext";
import Chart2DPage from "./pages/Chart2DPage";
import Chart3DPage from "./pages/Chart3DPage";
import InsightsPage from "./pages/InsightsPage";
import DataTableView from "./pages/DataTableView";
import AdminPending from "./pages/AdminPending";
import SuperAdminDashboard from "./pages/Super Admin/SuperAdminDashboard";
import ApprovedAdmins from "./pages/Super Admin/ApprovedAdmins";
import RejectedAdmins from "./pages/Super Admin/RejectedAdmins";
import PendingAdmins from "./pages/Super Admin/PendingAdmins";
import AdminAllUsers from "./pages/Admin/AdminAllUsers";
import AdminBlockUnblock from "./pages/Admin/AdminBlockUnblock";
import AdminUserDetails from "./pages/Admin/AdminUserDetails";
import AdminSummaryStats from "./pages/Admin/AdminSummaryStats";
import SettingsPage from "./pages/Settings";
import SuperadminAllUsers from "./pages/Super Admin/SuperadminAllUsers";
import SuperadminUserDetails from "./pages/Super Admin/SuperadminUserDetails";
import SuperadminAllAdmins from "./pages/Super Admin/SuperadminAllAdmins";
import SuperadminAdminDetails from "./pages/Super Admin/SuperadminAdminDetails";

// port ka jarur dhuan rkhna uar abhi port 5174 par chala rha ok

const App = () => {
  return (
    <UserProvider>
      {/* 2000 -> 2 seconds */}
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Home />} />
        {/* Pages ke andr home wala compnoent jab bhi '/dashboard' par route chale toh jo component pass hoga woh render hoga, ab yhan Home component render hoga */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/charts/2d" element={<Chart2DPage />} />
        <Route path="/charts/3d" element={<Chart3DPage />} />
        <Route path="/charts/insights" element={<InsightsPage />} />
        <Route path="/charts/table" element={<DataTableView />} />
        <Route path="/admin-pending" element={<AdminPending />} />
        <Route
          path="/super-admin/dashboard"
          element={<SuperAdminDashboard />}
        />
        <Route path="/super-admin/users" element={<SuperadminAllUsers />} />
        <Route path="/super-admin/admins" element={<SuperadminAllAdmins />} />
        <Route path="/super-admin/user/:id" element={<SuperadminUserDetails />} />
        <Route path="/super-admin/admin/:id" element={<SuperadminAdminDetails />} />
        <Route path="/super-admin/approved" element={<ApprovedAdmins />} />
        <Route path="/super-admin/rejected" element={<RejectedAdmins />} />
        <Route path="/super-admin/pending" element={<PendingAdmins />} />

        <Route path="/admin/users" element={<AdminAllUsers />} />
        <Route path="/admin/toggleBlock" element={<AdminBlockUnblock />} />
        <Route path="/admin/user/:id" element={<AdminUserDetails />} />
        <Route path="/admin/summary" element={<AdminSummaryStats />} />

        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </UserProvider>
  );
};

const Root = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // If token or user missing then
  if (!token || !user) {
    return <Navigate to="/home" />;
  }

  // Role-based routing
  if (user.role === "super-admin") {
    return <Navigate to="/super-admin/dashboard" />;
  } else if (user.role === "admin" || user.role === "user") {
    return <Navigate to="/dashboard" />;
  }
};

export default App;
