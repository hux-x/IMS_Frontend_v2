import React, { useState } from "react";
import { toast } from "react-toastify";
import authService from "@/apis/services/authService";

export default function ForgotPassword() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(emailOrUsername);
      toast.success("Password reset link sent to your email (if account exists)");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md space-y-6">
        <h2 className="text-xl font-bold text-center text-gray-700">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center">
          Enter your email or username to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Email or Username</label>
            <input
              id="identifier"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              placeholder="Enter your email or username"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-green-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}