import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const PasswordResetModal = ({ setIsPasswordResetOpen, isPasswordResetOpen }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showModal, setShowModal] = useState(false);
const backendUrl = import.meta.env.VITE_REACT_APP_API_BACKEND_URL;

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Error & success messages
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isPasswordResetOpen) {
      setShowModal(true);
    }
  }, [isPasswordResetOpen]);

  if (!isPasswordResetOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword) newErrors.newPassword = "New password is required";
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await axios.put(`${backendUrl}/api/auth/resetPassword`, {
          email: formData.username,
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }, { withCredentials: true });

  setMessage(res.data.message); // success message
  setFormData({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  setTimeout(() => setIsPasswordResetOpen(false), 2000);
} catch (error) {
  console.error("Reset password error:", error);

  // This will show backend error messages, e.g., "User not found"
  setMessage(error.response?.data?.message || "Something went wrong");
}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setIsPasswordResetOpen(false)}
      />

      <div
        className={`relative bg-white z-60 w-[90%] md:w-[80%] max-w-3xl p-4 md:p-6 rounded-md shadow-xl flex flex-col animate-fadeIn
          transform transition-transform duration-500 ease-out
          ${showModal ? "translate-y-0 opacity-100" : "-translate-y-96 opacity-0"}
        `}
      >
        <h2 className="text-lg font-semibold text-[#002147] mb-4">
          Reset Password
        </h2>

        {message && (
          <p className="mb-3 text-sm text-center requiredField">
            {message}
          </p>
        )}

        <form className="space-y-4 flex flex-wrap justify-between" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username or email"
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {errors.username && (
              <p className="requiredField">{errors.username}</p>
            )}
          </div>

          {/* Current Password */}
          <div className="md:w-[49%] w-full relative">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Current Password
            </label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="current password"
              className="w-full border border-gray-300 rounded-md p-2 outline-none pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-[35px] text-gray-500 cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
            {errors.currentPassword && (
              <p className="requiredField">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="md:w-[49%] w-full relative">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="new password"
              className="w-full border border-gray-300 rounded-md p-2 outline-none pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-[35px] text-gray-500 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
            {errors.newPassword && (
              <p className="requiredField">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="md:w-[49%] w-full relative">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="confirm password"
              className="w-full border border-gray-300 rounded-md p-2 outline-none pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-[35px] text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
            {errors.confirmPassword && (
              <p className="requiredField">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <div className="mt-4 w-[100%]">
            <button
              type="submit"
              className="px-4 font-medium cursor-pointer py-2 w-full bg-[#002147] hover:bg-[#013168] text-white rounded-md"
            >
              Reset Password
            </button>
          </div>
        </form>

        <button
          onClick={() => setIsPasswordResetOpen(false)}
          className="absolute -top-3 -right-3 bg-white shadow-md hover:shadow-none rounded-md p-2 cursor-pointer text-gray-500 text-xl hover:translate-y-3 hover:-translate-x-3 transition-all duration-300"
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default PasswordResetModal;
