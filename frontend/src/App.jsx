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

// port ka jarur dhuan rkhna uar abhi port 5174 par chala rha ok

const App = () => {
  return (
    <UserProvider>
      {/* 2000 -> 2 seconds */}
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Home />} /> // Pages ke andr home
        wala compnoent jab bhi '/dashboard' par route chale toh jo component
        pass hoga woh render hoga, ab yhan Home component render hoga
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/charts/2d" element={<Chart2DPage />} />
        <Route path="/charts/3d" element={<Chart3DPage />} />
        <Route path="/charts/insights" element={<InsightsPage />} />
        <Route path="/charts/table" element={<DataTableView />} />
        {/* <Route path='/admin' element={<Admin/>}/>  */}
        {/*<Route path='/register' element={<Sidebar/>}/> */}
      </Routes>
    </UserProvider>
  );
};

const Root = () => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/home" />
  );
};

export default App;
