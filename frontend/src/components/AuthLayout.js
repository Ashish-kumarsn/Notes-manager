import React from "react";
import { useLocation } from "react-router-dom";

export default function AuthLayout({ children }) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {/* Form content - Login ya Register form yahan render hoga */}
        {children}
      </div>
    </div>
  );
}