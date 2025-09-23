import React, { useState, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";

const QuestionBankUpdateModal = ({ 
  isUpdateModalOpen, 
  setIsUpdateModalOpen, 
  editDocument, 
  documentName, 
  years,
  onSuccess,
  examTypes
}) => {
  const baseUrl = "http://localhost:3000";

  const [formData, setFormData] = useState({
    name: editDocument?.name || "",
    type: editDocument?.type || "",
    year: editDocument?.year || "",
    status: editDocument?.status || "",
    questionPaper: null,
    answerKey: null,
    keyExplanation: null,
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isUpdateModalOpen) {
      setShowModal(true);
      setFormData({
        name: editDocument?.name || "",
        type: editDocument?.type || "",
        year: editDocument?.year || "",
        status: editDocument?.status || "",
        questionPaper: null,
        answerKey: null,
        keyExplanation: null,
      });
    }
  }, [isUpdateModalOpen, editDocument]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Title is required.";
    if (!formData.type) newErrors.type = "Type is required.";
    if (!formData.year) newErrors.year = "Year is required.";
    if (!formData.status) newErrors.status = "Status is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("year", formData.year);

      if (formData.questionPaper) {
        formDataToSend.append("questionPaper", formData.questionPaper);
      }
      if (formData.answerKey) {
        formDataToSend.append("answerKey", formData.answerKey);
      }
      if (formData.keyExplanation) {
        formDataToSend.append("keyExplanation", formData.keyExplanation);
      }

      const res = await axios.put(
        `${baseUrl}/api/questionBank/${editDocument.id}`,
        formDataToSend,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Question Bank updated:", res.data);
      setIsUpdateModalOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  if (!isUpdateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setIsUpdateModalOpen(false)}
      />

      <div
        className={`relative bg-white z-60 w-[90%] md:w-[80%] max-w-3xl p-4 md:p-6 rounded-md shadow-xl
          transform transition-transform duration-500 ease-out
          ${showModal ? "translate-y-0 opacity-100" : "-translate-y-96 opacity-0"}
        `}
      >
        <h2 className="text-lg font-semibold text-[#002147] mb-4">
          Update Question Bank
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap justify-between">
          {/* Title */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Title
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Title"
              className={`w-full border rounded-md p-2 outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && <p className="requiredField">{errors.name}</p>}
          </div>

          {/* Type */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Select Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none appearance-none"
            >
              <option value="">Select Type</option>
              {examTypes.map((exam) => (
                <option key={exam.id} value={exam.name}>
                  {exam.name}
                </option>
              ))}
            </select>
            {errors.type && <p className="requiredField">{errors.type}</p>}
          </div>

          {/* Year */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Select Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full border rounded-md appearance-none p-2 outline-none ${errors.year ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year.id} value={year.name}>{year.name}</option>
              ))}
            </select>
            {errors.year && <p className="requiredField">{errors.year}</p>}
          </div>

          {/* Status */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 appearance-none rounded-md p-2 outline-none"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && <p className="requiredField">{errors.status}</p>}
          </div>

          {/* Question Paper Upload */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Question Paper</label>
            <input
              type="file"
              name="questionPaper"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {editDocument?.questionPaperPath && (
              <p className="mt-1 text-sm ml-2">
                Current File:{" "}
                <a
                  href={`${baseUrl}/${editDocument.questionPaperPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View PDF
                </a>
              </p>
            )}
          </div>

          {/* Answer Key Upload */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Answer Key</label>
            <input
              type="file"
              name="answerKey"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {editDocument?.answerKeyPath && (
              <p className="mt-1 text-sm ml-2">
                Current File:{" "}
                <a
                  href={`${baseUrl}/${editDocument.answerKeyPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View PDF
                </a>
              </p>
            )}
          </div>

          {/* Key Explanation Upload */}
          {formData.type==="Test Series" && <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Answer Key with Explanation</label>
            <input
              type="file"
              name="keyExplanation"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {editDocument?.keyExplanationPath ? (
              <p className="mt-1 text-sm ml-2">
                Current File:{" "}
                <a
                  href={`${baseUrl}/${editDocument.keyExplanationPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View PDF
                </a>
              </p>
            ) : (
              <p className="mt-1 ml-2 text-gray-500 text-sm">--</p>
            )}
          </div>}

          {/* Submit */}
          <div className="mt-4 w-full">
            <input
              type="submit"
              value="Update"
              className="px-4 cursor-pointer font-medium py-2 w-full bg-[#002147] hover:bg-[#013168] text-white rounded-md"
            />
          </div>
        </form>

        <button
          onClick={() => setIsUpdateModalOpen(false)}
          className="absolute -top-3 -right-3 bg-white shadow-md hover:shadow-none rounded-md p-2 cursor-pointer text-gray-500 text-xl hover:translate-y-3 hover:-translate-x-3 transition-all duration-300"
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default QuestionBankUpdateModal;
