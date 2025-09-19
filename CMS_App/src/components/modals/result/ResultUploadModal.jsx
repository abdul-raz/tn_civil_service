import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";

const ResultUpload = ({ setIsAdd, types, years, onSuccess }) => {
  const baseUrl = "http://localhost:3000";

  const [formData, setFormData] = useState({
    title: "",
    typeId: "",
    year: "",
    status: "Inactive",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (setIsAdd) {
      setFormData({
        title: "",
        typeId: "",
        year: "",
        status: "Inactive",
        file: null,
      });
      setErrors({});
      setSubmitError("");
    }
  }, [setIsAdd]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files?.[0] || null }));
      setErrors((prev) => ({ ...prev, file: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.typeId) newErrors.typeId = "Type is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.file) newErrors.file = "PDF file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("typeId", formData.typeId);
    data.append("year", formData.year);
    data.append("status", formData.status);
    data.append("file", formData.file);

    try {
      await axios.post(`${baseUrl}/api/result`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setIsAdd(false);
      onSuccess();
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to create result");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => setIsAdd(false)}
    >
      <div
        className="bg-white z-50 w-[90%] md:w-[80%] p-6 max-w-3xl rounded-md shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#002147]">Add New Result</h2>
          <button
            onClick={() => setIsAdd(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap justify-between">
          {/* Title */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none ${
                errors.title ? "border-red-600" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="requiredField">{errors.title}</p>}
          </div>

          {/* Type */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Type</label>
            <select
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none ${
                errors.typeId ? "border-red-600" : "border-gray-300"
              }`}
            >
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.typeId && <p className="requiredField">{errors.typeId}</p>}
          </div>

          {/* Year */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none ${
                errors.year ? "border-red-600" : "border-gray-300"
              }`}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y.id} value={y.name}>
                  {y.name}
                </option>
              ))}
            </select>
            {errors.year && <p className="requiredField">{errors.year}</p>}
          </div>

          {/* Status */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none ${
                errors.status ? "border-red-600" : "border-gray-300"
              }`}
            >
              <option value="Inactive">Inactive</option>
              <option value="Active">Active</option>
            </select>
            {errors.status && <p className="requiredField">{errors.status}</p>}
          </div>

          {/* PDF Upload */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Upload PDF</label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className={`w-full border rounded-md p-2 cursor-pointer ${
                errors.file ? "border-red-600" : "border-gray-300"
              }`}
            />
            {errors.file && <p className="requiredField">{errors.file}</p>}
          </div>

          <div className="w-full mt-4">
            {submitError && (
              <p className="requiredField text-center">{submitError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#002147] text-white p-2 rounded-md hover:bg-[#013168]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultUpload;
