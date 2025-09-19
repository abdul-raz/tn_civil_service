import axios from "axios";
import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const QuestionBankUploadModal = ({ 
  fetchQuestionBanks, 
  setIsAddNewModalOpen, 
  examTypes, 
  years 
}) => {
  const baseUrl = "http://localhost:3000"; // move to env later

  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [questionPaper, setQuestionPaper] = useState(null);
  const [answerKey, setAnswerKey] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    let newErrors = {};
    let isValid = true;

    if (!type) {
      newErrors.type = "Type is required.";
      isValid = false;
    }
    if (!year) {
      newErrors.year = "Year is required.";
      isValid = false;
    }
    if (!questionPaper) {
      newErrors.questionPaper = "Question Paper is required.";
      isValid = false;
    }
    if (!answerKey) {
      newErrors.answerKey = "Answer Key is required.";
      isValid = false;
    }
    if (type === "Test Series" && !explanation) {
      newErrors.explanation = "Explanation file is required for Test Series.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        const formData = new FormData();
        formData.append("type", type);
        formData.append("year", year);
        formData.append("questionPaper", questionPaper);
        formData.append("answerKey", answerKey);
        if (explanation) {
          formData.append("keyExplanation", explanation);
        }

        const res = await axios.post(`${baseUrl}/api/questionBank`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        setMessage(res.data.message || "Question Bank uploaded successfully!");
        setIsAddNewModalOpen(false);
        fetchQuestionBanks();
      } catch (error) {
        console.error("Upload error:", error);
        setMessage(error.response?.data?.message || "Upload failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="absolute inset-0"
        onClick={() => setIsAddNewModalOpen(false)}
      />
      <div className="bg-white w-[90%] md:w-[80%] md:p-6 p-4 max-w-3xl relative shadow-xl animate-fadeIn rounded-md">
        <h2 className="text-lg font-semibold text-[#002147] mb-4">
          Add Question Bank
        </h2>

        {message && (
          <p className="text-center text-sm font-medium text-green-600 mb-2">
            {message}
          </p>
        )}

        <form onSubmit={handleUpload} className="space-y-4 flex flex-wrap justify-between">
          {/* Type */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Select Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full border rounded-md p-2 appearance-none outline-none ${
                errors.type ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
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
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Select Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`w-full border rounded-md appearance-none p-2 outline-none ${
                errors.year ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Year</option>
              {years.map((yr) => (
                <option key={yr.id} value={yr.name}>
                  {yr.name}
                </option>
              ))}
            </select>
            {errors.year && <p className="requiredField">{errors.year}</p>}
          </div>

          {/* Show file fields once type is chosen */}
          {type && (
            <>
              {/* Question Paper */}
              <div className="relative md:w-[49%] w-full">
                <label className="block mb-1 text-sm text-gray-700 font-medium">
                  Question Paper
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setQuestionPaper(e.target.files[0])}
                  className={`w-full border rounded-md p-2 outline-none ${
                    errors.questionPaper ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors.questionPaper && (
                  <p className="requiredField">{errors.questionPaper}</p>
                )}
              </div>

              {/* Answer Key */}
              <div className="relative md:w-[49%] w-full">
                <label className="block mb-1 text-sm text-gray-700 font-medium">
                  Answer Key
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setAnswerKey(e.target.files[0])}
                  className={`w-full border rounded-md p-2 outline-none ${
                    errors.answerKey ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors.answerKey && (
                  <p className="requiredField">{errors.answerKey}</p>
                )}
              </div>

              {/* Explanation (only for Test Series) */}
              {type === "Test Series" && (
                <div className="relative md:w-[49%] w-full">
                  <label className="block mb-1 text-sm text-gray-700 font-medium">
                    Answer Key with Explanation
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setExplanation(e.target.files[0])}
                    className={`w-full border rounded-md p-2 outline-none ${
                      errors.explanation ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.explanation && (
                    <p className="requiredField">{errors.explanation}</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Submit */}
          <div className="mt-4 w-full">
            <button
              type="submit"
              className="px-4 py-2 w-full cursor-pointer bg-[#002147] hover:bg-[#013168] text-white rounded-md"
            >
              Upload Files
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={() => setIsAddNewModalOpen(false)}
          className="absolute -top-3 -right-3 bg-white shadow-md hover:shadow-none rounded-md p-2 cursor-pointer text-gray-500 text-xl hover:translate-y-3 hover:-translate-x-3 transition-all duration-300"
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default QuestionBankUploadModal;
