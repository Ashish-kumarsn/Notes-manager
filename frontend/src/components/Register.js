import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setToken } from "../api";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // ✅ NEW: Import jwt-decode

export default function Register({ setUser }) {
  // 1. Initial state only needs name and email (no password)
  const [form, setForm] = useState({ name: "", email: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = enter details, 2 = enter OTP
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  /* ------------ STEP 1: request OTP ------------ */
  async function requestOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ FIXED: Changed from /auth/send-otp to /auth/request-otp
      await API.post("/auth/request-otp", form);
      alert("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
      console.error("Send OTP error:", err);
      alert(err.response?.data?.message || "Failed to send OTP."); 
    } finally {
      setLoading(false);
    }
  }

  /* ------------ STEP 2: verify OTP ------------ */
  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ FIXED: Changed from /auth/verify-otp to /auth/verify-registration
      // ✅ FIXED: Now sending name along with email and OTP
      const { data } = await API.post("/auth/verify-registration", {
        email: form.email,
        name: form.name, // ✅ ADDED: Backend requires name
        otp,
      });
      
      alert("Registration successful!"); 
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      nav("/notes"); // ✅ FIXED: Navigate to /notes instead of /
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert(err.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  /* ✅ FIXED: Google Sign-In Handler - Now extracts user info from JWT */
  async function handleGoogleSuccess(googleResponse) {
    try {
      const { credential } = googleResponse;
      
      // ✅ NEW: Decode the JWT to extract user information
      const decoded = jwtDecode(credential);
      const { sub: googleId, email, name } = decoded;

      // ✅ FIXED: Now sending googleId, email, and name
      const { data } = await API.post("/auth/google", {
        googleId,
        email,
        name,
      });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      nav("/notes"); // ✅ FIXED: Navigate to /notes
    } catch (err) {
      alert("Google login failed.");
      console.error("Google login failed:", err);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center text-2xl font-semibold mb-6">Create Account</div>
      
      {step === 1 && (
        <form onSubmit={requestOtp}>
          {/* Input: Name */}
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            disabled={loading}
          />
          {/* Input: Email */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          
          <div className="text-center my-4 text-gray-500">OR</div>

          {/* Google Sign-In Button */}
          <div className="mt-4 flex justify-center">
            <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => { 
                    console.error("Google login failed");
                    alert("Google login failed."); 
                }} 
            />
          </div>
          
          <div className="text-center mt-4">
             Already have an account?{" "}
             <span className="text-indigo-600 cursor-pointer hover:underline" onClick={() => nav("/login")}>
               Login
             </span>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp}>
          <p className="mb-4 text-sm text-gray-600">
            OTP sent to <strong>{form.email}</strong>. Enter it below to complete registration.
          </p>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
          
          {/* ✅ NEW: Option to go back */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Change Email/Name
            </button>
          </div>
        </form>
      )}
    </div>
  );
}