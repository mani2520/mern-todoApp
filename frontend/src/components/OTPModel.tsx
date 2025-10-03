import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OTPModel = ({
  email,
  onClose,
  otpType = "verify",
}: {
  email: string;
  onClose: () => void;
  otpType?: "verify" | "delete";
}) => {
  const [otp, setOtp] = useState("");
  const {
    token,
    username,
    email: currentEmail,
    updateUser,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint =
        otpType === "verify"
          ? email === currentEmail
            ? "/verify-email"
            : "/verify-new-email"
          : "/delete-account";
      const res = await api.post(
        endpoint,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (otpType === "delete") {
        toast.success("Account deleted successfully!");
        logout();
        navigate("/login");
      } else {
        toast.success(
          res.data?.message || `Email ${email} verified successfully`
        );
        if (res.data?.email || res.data?.verified) {
          updateUser(
            username || "",
            res.data.email || email,
            res.data.verified || true
          );
        }
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          OTP sent to <span className="font-medium">{email}</span>. <br />
          Please enter it below.
        </p>
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-lg tracking-widest"
            maxLength={6}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
              disabled={!otp.trim()}
            >
              Verify
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors font-semibold"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPModel;
