import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/forgot-password", { email });
      toast.success("OTP send to your email");
      setEmail("");
      navigate("/reset-password");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>
        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">
            Remembered your password?
          </span>
          <br />
          <a
            href="/login"
            className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
