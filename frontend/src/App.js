import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Notes from "./components/Notes";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import AuthLayout from "./components/AuthLayout";
import { setToken } from "./api"; // ✅ NEW: Import setToken
import "./index.css";

export default function App() {
  const [user, setUser] = useState(null);

  // ✅ FIXED: Check if user is logged in on app start AND initialize token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setToken(token); // ✅ NEW: Initialize axios headers with token
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else if (token) {
      // If only token exists, create minimal user object
      setUser({ token });
      setToken(token); // ✅ NEW: Initialize axios headers with token
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null); // ✅ NEW: Clear token from axios headers
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show Navbar only for non-admin routes */}
      {!(user?.role === "admin") && (
        <Navbar user={user} handleLogout={handleLogout} />
      )}

      <Routes>
        {/* Login Route with AuthLayout */}
        <Route
          path="/login"
          element={
            !user ? (
              <AuthLayout>
                <Login setUser={setUser} />
              </AuthLayout>
            ) : (
              <Navigate to={user.role === "admin" ? "/admin" : "/notes"} />
            )
          }
        />

        {/* Register Route with AuthLayout */}
        <Route
          path="/register"
          element={
            !user ? (
              <AuthLayout>
                <Register setUser={setUser} />
              </AuthLayout>
            ) : (
              <Navigate to={user.role === "admin" ? "/admin" : "/notes"} />
            )
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard 
                token={localStorage.getItem("token")} 
                user={user} 
                onLogout={handleLogout} 
              />
            ) : user ? (
              <Navigate to="/notes" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Notes Route (Regular Users Only) */}
        <Route
          path="/notes"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Notes user={user} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate to={
              user 
                ? (user.role === "admin" ? "/admin" : "/notes")
                : "/login"
            } />
          }
        />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}