import axios from "axios";
import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const QuestionBankUploadModal = ({ fetchQuestionBanks, setIsAddNewModalOpen, examTypes ,years}) => {
  const baseUrl = "http://localhost:3000"; // base URL

  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [questionPaper, setQuestionPaper] = useState(null);

  const [errors, setErrors] = useState({
    type: "",
    year: "",
    questionPaper: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { type: "", year: "", questionPaper: "" };
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

    setErrors(newErrors);

    if (isValid) {
      try {
        const formData = new FormData();
        formData.append("type", type);
        formData.append("year", year);
        formData.append("file", questionPaper);

        const res = await axios.post(
          `${baseUrl}/api/questionBank`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        setMessage(res.data.message);
        setType("");
        setYear("");
        setQuestionPaper(null);
        setIsAddNewModalOpen(false);
      } catch (error) {
        console.error("Upload error:", error);
        setMessage(error.response?.data?.message || "Upload failed");
      }finally{
         fetchQuestionBanks();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="absolute inset-0"
        onClick={() => setIsAddNewModalOpen(false)}
      />
      <div className="bg-white w-[90%] z-60 md:w-[80%] md:p-6 p-4 max-w-3xl relative shadow-xl animate-fadeIn rounded-md">
        <h2 className="text-lg font-semibold text-[#002147] mb-4">
          Add Question Bank
        </h2>

        {message && (
          <p className="text-center text-sm font-medium text-green-600 mb-2">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-wrap justify-between"
        >
          {/* Type select */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Select Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setErrors((prev) => ({ ...prev, type: "" }));
              }}
              className={`w-full border rounded-md p-2 outline-none appearance-none ${errors.type
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
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

          {/* Year select */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Select Year
            </label>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setErrors((prev) => ({ ...prev, type: "" }));
              }}
              className={`w-full border rounded-md p-2 outline-none appearance-none ${errors.type
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
                }`}
            >
              <option value="">Select Type</option>
              {years.map((year) => (
                <option key={year.id} value={year.name}>
                  {year.name}
                </option>
              ))}
            </select>
            {errors.type && <p className="requiredField">{errors.type}</p>}
          </div>

          {/* File input */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Question Paper
            </label>
            <input
              type="file"
              accept="application/pdf"
              className={`w-full border rounded-md p-2 outline-none ${errors.questionPaper
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
                }`}
              onChange={(e) => {
                const file = e.target.files[0];
                setQuestionPaper(file);
                if (file) {
                  setErrors((prev) => ({ ...prev, questionPaper: "" }));
                }
              }}
            />
            {errors.questionPaper && (
              <p className="requiredField">{errors.questionPaper}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 w-full">
            <button
              type="submit"
              className="px-4 font-medium cursor-pointer py-2 w-full bg-[#002147] hover:bg-[#013168] text-white rounded-md"
            >
              Save
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
