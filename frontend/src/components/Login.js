import React, { useState } from "react";
import API, { setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  // State now tracks email (no password needed) and OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  /* ------------ STEP 1: Request OTP for Login ------------ */
  async function requestLoginOtp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIXED: Correct endpoint
      await API.post("/auth/send-login-otp", { email }); 
      alert("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
      console.error("Request OTP error:", err);
      alert(err.response?.data?.message || "Failed to send OTP. Is your email registered?");
    } finally {
      setLoading(false);
    }
  }

  /* ------------ STEP 2: Verify OTP and Login ------------ */
  async function submitLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIXED: Changed from /auth/login-otp to /auth/login
      const res = await API.post("/auth/login", { email, otp }); 
      const token = res.data.token;
      const userData = res.data.user;

      // Store credentials
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData)); 
      setToken(token);
      setUser(userData);

      alert("Login successful!");

      // Redirect
      if (userData.role === "admin") {
        nav("/admin"); 
      } else {
        nav("/notes"); 
      }

    } catch (err) {
      console.error("Login OTP verification error:", err);
      alert(err.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center text-2xl font-semibold mb-6">Login</div>

      {/* STEP 1: Enter Email */}
      {step === 1 && (
        <form onSubmit={requestLoginOtp}>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Get Login OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: Enter OTP */}
      {step === 2 && (
        <form onSubmit={submitLogin}>
          <p className="mb-4 text-sm text-gray-600">
            OTP sent to <strong>{email}</strong>. Enter it below to log in.
          </p>
          <input
            placeholder="Enter 6-digit OTP"
            type="text"
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
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          {/* ✅ NEW: Option to resend OTP */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Change Email
            </button>
          </div>
        </form>
      )}
      
      <div className="text-center mt-4">
        Don't have an account?{" "}
        <span className="text-indigo-600 cursor-pointer hover:underline" onClick={() => nav("/register")}>
          Create an Account
        </span>
      </div>
    </div>
  );
}