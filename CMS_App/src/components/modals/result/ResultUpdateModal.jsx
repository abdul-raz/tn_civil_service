import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";

const ResultUpdateModal = ({
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  editDocument,
  onSuccess,
  types,
  years,
  baseUrl = process.env.REACT_APP_BACKEND_URL,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    typeId: "",
    year: "",
    status: "1", // default to active "1"
    file: null,
    pdfPath: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isUpdateModalOpen && editDocument) {
      setFormData({
        title: editDocument.title || "",
        typeId: editDocument.typeId ? String(editDocument.typeId) : "",
        year: editDocument.year || "",
        status:
          editDocument.status !== undefined ? String(editDocument.status) : "1",
        file: null,
        pdfPath: editDocument.pdfPath || "",
      });
      setErrors({});
      setSubmitError("");
    }
  }, [isUpdateModalOpen, editDocument]);

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("typeId", parseInt(formData.typeId, 10));
      data.append("year", formData.year);
      data.append("status", Number(formData.status)); // convert to number for backend
      if (formData.file) data.append("file", formData.file);

      await axios.put(`${baseUrl}/api/result/${editDocument.id}`, data, {
        withCredentials: true,
        // do NOT set Content-Type manually to allow axios to manage headers
      });

      setIsUpdateModalOpen(false);
      onSuccess();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Failed to update result"
      );
    }
  };

  if (!isUpdateModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => setIsUpdateModalOpen(false)}
    >
      <div
        className="bg-white z-50 rounded-md max-w-xl p-6 shadow-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Update Result</h2>
          <button
            onClick={() => setIsUpdateModalOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        {submitError && <p className="text-red-600 mb-3">{submitError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md outline-none ${
                errors.title ? "border-red-600" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md outline-none ${
                errors.typeId ? "border-red-600" : "border-gray-300"
              }`}
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.typeId && (
              <p className="text-red-600 mt-1">{errors.typeId}</p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block mb-1 font-medium">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md outline-none ${
                errors.year ? "border-red-600" : "border-gray-300"
              }`}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year.id} value={year.name}>
                  {year.name}
                </option>
              ))}
            </select>
            {errors.year && <p className="text-red-600 mt-1">{errors.year}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md outline-none ${
                errors.status ? "border-red-600" : "border-gray-300"
              }`}
            >
              <option value="0">Inactive</option>
              <option value="1">Active</option>
            </select>
            {errors.status && (
              <p className="text-red-600 mt-1">{errors.status}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-1 font-medium">
              Upload PDF (Leave empty to keep existing)
            </label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border p-2 rounded-md cursor-pointer"
            />
            {!formData.file && formData.pdfPath && (
              <p className="mt-1">
                Current file:{" "}
                <a
                  href={`${baseUrl}/${formData.pdfPath.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResultUpdateModal;
