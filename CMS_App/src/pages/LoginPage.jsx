import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginPage = ({ setLog }) => {
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoginForm, setLoginForm] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Login function
  const handleLogin = async () => {
    if (!formData.email.trim()) return setErrors({ email: "Email required" });
    if (!formData.password.trim()) return setErrors({ password: "Password required" });

    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) return setErrors({ general: data.message || "Login failed" });
      setLog(true);
    } catch (error) {
      setErrors({ general: "Network error" });
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!formData.email.trim()) return setErrors({ email: "Email required" });
    try {
      const res = await fetch(`${backendUrl}/api/auth/createOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) return setErrors({ general: data.message || "Failed to send OTP" });

      setOtpSent(true); // Show OTP input
      alert("OTP sent to your email");
    } catch (error) {
      setErrors({ general: "Network error" });
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (formData.otp.length !== 6) return setErrors({ otp: "Enter 6-digit OTP" });
    try {
      const res = await fetch(`${backendUrl}/api/auth/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data = await res.json();
      if (!res.ok) return setErrors({ general: data.message || "Invalid OTP" });

      alert("OTP verified! Please set your new password.");
      setOtpVerified(true);
      setOtpSent(false);
    } catch (error) {
      setErrors({ general: "Network error" });
    }
  };

  // Update password after OTP verification
  const handleUpdatePassword = async () => {
    if (!formData.newPassword.trim()) return setErrors({ general: "New password required" });
    if (formData.newPassword !== formData.confirmPassword)
      return setErrors({ general: "Passwords do not match" });

    try {
      const res = await fetch(`${backendUrl}/api/auth/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setErrors({ general: data.message || "Failed to update password" });

      alert("Password updated successfully! You can now login.");
      setOtpVerified(false);
      setLoginForm(true);
      setFormData({ email: "", password: "", otp: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setErrors({ general: "Network error" });
    }
  };

  return (
    <section className="bg-[#e9e8e8] md:min-h-screen flex justify-center items-center p-5">
      <div className="relative w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden">
        <div className="md:w-1/2 bg-gradient-to-br from-[#a7a5a5d4] to-[#bebcbc80] p-4">
          <img
            src="/cms/poster.avif"
            alt="Login Poster"
            className="h-full w-full object-cover rounded-tl-xl rounded-bl-xl"
          />
        </div>

        <div className="relative z-10 md:w-1/2 w-full bg-white/90 backdrop-blur-sm md:backdrop-blur-0 md:bg-white p-6 sm:px-10 sm:py-20 md:space-y-10 space-y-4">
          <div className="flex justify-center items-center md:gap-4 gap-2">
            <img src="/cms/TN_logo.png" alt="TN_logo" className="w-10 h-10" />
            <div className="flex flex-col">
              <p className="primary font-bold md:text-sm text-[13px]">
                All India Civil Services Coaching Centre
              </p>
              <small className="primary text-[10px]">
                A Unit of Anna Institute of Management
              </small>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2 md:space-y-3 text-center">
            <h2 className="text-gray-800 font-bold md:text-2xl text-lg">
              {isLoginForm ? "Login to Your Account" : otpVerified ? "Set New Password" : "Forgot Password"}
            </h2>
            <p className="text-gray-500 md:text-sm text-[11px]">
              {isLoginForm
                ? "Welcome back, please enter your details."
                : otpVerified
                ? "Enter your new password."
                : "Enter your email to receive a password reset OTP."}
            </p>
          </div>

{/* Forgot password: send OTP */}
{!otpSent && !isLoginForm && !otpVerified && (
  <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
    <div>
      <label className="primary text-sm font-bold md:mb-1 mb-2">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} md:rounded-xl rounded-md placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-[15px] p-1 px-2 md:p-3 outline-none`}
      />
      {errors.email && <p className="requiredField text-red-500 text-sm">{errors.email}</p>}
    </div>

    <input
      type="button"
      value="Send OTP"
      onClick={handleSendOtp}
      className="bg-[#eead21] hover:bg-[#fab82b] p-1 px-2 md:p-3 md:rounded-xl rounded-md text-white font-medium mt-2 cursor-pointer"
    />

    {/* General error alert */}
    {errors.general && <p className="requiredField text-red-600 text-center">{errors.general}</p>}

    <p className="text-center text-sm text-gray-600">
      Remembered your password?{" "}
      <span onClick={() => setLoginForm(true)} className="text-blue-500 cursor-pointer">
        Login
      </span>
    </p>
  </form>
)}

{/* OTP input form */}
{otpSent && (
  <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
    <div>
      <label className="primary text-sm font-bold md:mb-1 mb-2">Enter OTP</label>
      <input
        type="text"
        name="otp"
        value={formData.otp}
        onChange={handleChange}
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        className={`w-full border ${errors.otp ? "border-red-500" : "border-gray-300"} md:rounded-xl rounded-md placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-[15px] p-1 px-2 md:p-3 outline-none`}
      />
      {errors.otp && <p className="requiredField text-red-500 text-sm">{errors.otp}</p>}
    </div>

    <input
      type="button"
      value="Verify OTP"
      onClick={handleVerifyOtp}
      className="bg-[#eead21] hover:bg-[#fab82b] p-1 px-2 md:p-3 md:rounded-xl rounded-md text-white font-medium mt-2 cursor-pointer"
    />

    {/* General error alert */}
    {errors.general && <p className="requiredField text-red-600 text-center">{errors.general}</p>}
  </form>
)}

{/* New password form */}
{otpVerified && (
  <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
    <div className="relative">
      <label className="primary text-sm font-bold md:mb-1 mb-2">New Password</label>
      <input
        type={showPassword ? "text" : "password"}
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="Enter new password"
        className="w-full border border-gray-300 md:rounded-xl rounded-md p-1 px-2 md:p-3 outline-none pr-10"
      />
      <button
        type="button"
        className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
      </button>
    </div>

    <div className="relative">
      <label className="primary text-sm font-bold md:mb-1 mb-2">Confirm Password</label>
      <input
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm new password"
        className="w-full border border-gray-300 md:rounded-xl rounded-md p-1 px-2 md:p-3 outline-none pr-10"
      />
    </div>

    <input
      type="button"
      value="Update Password"
      onClick={handleUpdatePassword}
      className="bg-[#eead21] hover:bg-[#fab82b] p-1 px-2 md:p-3 md:rounded-xl rounded-md text-white font-medium mt-2 cursor-pointer"
    />

    {/* General error alert */}
    {errors.general && <p className="requiredField text-red-600 text-center">{errors.general}</p>}
  </form>
)}


          {/* Login form */}
          {isLoginForm && !otpSent && !otpVerified && (
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
              <div>
                <label className="primary text-sm font-bold md:mb-1 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="new-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} md:rounded-xl rounded-md placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-[15px] p-1 px-2 md:p-3 outline-none`}
                />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center md:mb-1 mb-2">
                  <label className="primary text-sm font-bold">Password</label>
                  <p onClick={() => setLoginForm(false)} className="primary text-sm cursor-pointer hover:text-blue-400">
                    Forgot Password?
                  </p>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} md:rounded-xl rounded-md placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-[15px] p-1 px-2 md:p-3 outline-none pr-10`}
                />
                <button
                  type="button"
                  className="absolute right-3 cursor-pointer top-[38px] text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>

              {errors.general && <p className="requiredField text-red-600 text-center">{errors.general}</p>}

              <input
                type="submit"
                value="Sign In"
                onClick={handleLogin}
                className="bg-[#eead21] hover:bg-[#fab82b] p-1 px-2 md:p-3 md:rounded-xl rounded-md text-white font-medium mt-2 cursor-pointer"
              />
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
