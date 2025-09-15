import React, { useState, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";

const QuestionBankUpdateModal = ({ isUpdateModalOpen, setIsUpdateModalOpen, editDocument, documentName }) => {
  const [formData, setFormData] = useState({
    type: editDocument?.type || "",
    year: editDocument?.year || "",
    status: editDocument?.status || "",
    file: editDocument?.pathUrl || null,
  });

  const [errors, setErrors] = useState({}); // store field errors
  const [showModal, setShowModal] = useState(false); // slide animation state

  useEffect(() => {
    if (isUpdateModalOpen) {
      setShowModal(true);
    }
  }, [isUpdateModalOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "Type is required.";
    if (!formData.year) newErrors.year = "Year is required.";
    else if (formData.year < 2018) newErrors.year = "Year must be 2018 or above.";
    if (!formData.status) newErrors.status = "Status is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    console.log("Updated Data:", formData);
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
          <div className="relative md:w-[49%] w-[100%]">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Select Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none appearance-none"
            >
              <option value="">Select Type</option>
              <option value="AICSCC">AICSCC</option>
              <option value="UPSC">UPSC</option>
              <option value="Test Series">Test Series</option>
            </select>
            {errors.type && <p className="requiredField">{errors.type}</p>}
          </div>

          {/* Year input */}
          <div className="md:w-[49%] w-[100%]">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Year"
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {errors.year && <p className="requiredField">{errors.year}</p>}
          </div>

          <div className="relative md:w-[49%] w-[100%]">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              {documentName === "questionbank"
                ? "Question Paper"
                : documentName === "answerkey"
                ? "Answer Key"
                : "Answer Key with Explanation"}
            </label>

            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />

            {/* Existing PDF preview link */}
            {editDocument?.pathUrl && (
              <p className="flex pl-2.5 mt-1 gap-2 items-center">
                <label>Current File:</label>
                <a
                  href={editDocument.pathUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 w-fit gap-1"
                >
                  View PDF
                </a>
              </p>
            )}
          </div>

          {/* Status select */}
          <div className="relative md:w-[49%] w-[100%]">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none appearance-none"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && <p className="requiredField">{errors.status}</p>}
          </div>

          <div className="mt-4 w-full">
            <input
              type="submit"
              value="Update"
              className="px-4 font-medium cursor-pointer py-2 w-full bg-[#002147] hover:bg-[#013168] text-white rounded-md"
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
