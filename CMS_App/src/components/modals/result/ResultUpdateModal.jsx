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
}) => {
  const baseUrl = "http://localhost:3000";

  const [formData, setFormData] = useState({
    title: "",
    typeId: "",
    year: "",
    status: "",
    file: null,
    pdfPath: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isUpdateModalOpen && editDocument) {
      setFormData({
        title: editDocument.title || "",
        typeId: editDocument.typeId || "",
        year: editDocument.year || "",
        status: editDocument.status || "",
        file: null,
        pdfPath: editDocument.pdfPath || "",
      });
      setErrors({});
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
    if (!validateForm()) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("typeId", formData.typeId);
    data.append("year", formData.year);
    data.append("status", formData.status);
    if (formData.file) data.append("file", formData.file);

    try {
      await axios.put(`${baseUrl}/api/result/${editDocument.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setIsUpdateModalOpen(false);
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update result.");
    }
  };

  if (!isUpdateModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => setIsUpdateModalOpen(false)}
    >
      <div
        className="bg-white z-50 w-[90%] md:w-[80%] p-6 max-w-3xl relative shadow-xl rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#002147] mb-4">Update Result</h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap justify-between">
          {/* Title */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none ${errors.title ? "border-red-500" : "border-gray-300"}`}
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
              className={`w-full border rounded-md p-2 outline-none ${errors.typeId ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
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
              className={`w-full border rounded-md p-2 outline-none ${errors.year ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y.id} value={y.name}>{y.name}</option>
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
              className={`w-full border rounded-md p-2 outline-none ${errors.status ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Status</option>
              <option value="Inactive">Inactive</option>
              <option value="Active">Active</option>
            </select>
            {errors.status && <p className="requiredField">{errors.status}</p>}
          </div>

          {/* PDF Upload */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Upload PDF (optional)</label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border rounded-md p-2 outline-none"
            />
            {!formData.file && formData.pdfPath && (
              <p className="flex pl-2.5 mt-1 gap-2 items-center">
                Current File:{" "}
                <a
                  href={`${baseUrl}/${formData.pdfPath.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600"
                >
                  View PDF
                </a>
              </p>
            )}
          </div>

          <div className="mt-4 w-full">
            <button
              type="submit"
              className="px-4 py-2 w-full text-white bg-[#002147] rounded-md hover:bg-[#013168]"
            >
              Save
            </button>
          </div>
        </form>

        <button
          onClick={() => setIsUpdateModalOpen(false)}
          className="absolute -top-3 -right-3 bg-white rounded-md p-2 shadow-md cursor-pointer text-gray-500 text-xl hover:translate-y-2 hover:-translate-x-2 transition-all duration-300"
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default ResultUpdateModal;
