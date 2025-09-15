import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";

const QuestionBankUploadModal = ({ setIsAddNewModalOpen }) => {
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [questionPaper, setQuestionPaper] = useState(null);

  const [errors, setErrors] = useState({ type: '', year: '', questionPaper: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = { type: '', year: '', questionPaper: '' };
    let isValid = true;

    if (!type) {
      newErrors.type = "Type is required.";
      isValid = false;
    }

    if (!year) {
      newErrors.year = "Year is required.";
      isValid = false;
    } else if (parseInt(year, 10) < 2018) {
      newErrors.year = "Year must be 2018 or above.";
      isValid = false;
    }

    if (!questionPaper) {
      newErrors.questionPaper = "Question Paper is required.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log("Form submitted ✅", { type, year, questionPaper });
    }
  };

  const getFileInputs = () => {
    const baseClass = 'w-full border rounded-md p-2 outline-none';
    const errorClass = 'border-red-500 focus:ring-red-500';
    const normalClass = 'border-gray-300';

    const questionInput = (
      <div className="relative md:w-[49%] w-full">
        <label className='block mb-1 text-sm text-gray-700 font-medium'>
          Question Papers
        </label>
        <input
          type="file"
          accept="application/pdf"
          className={`${baseClass} ${errors.questionPaper ? errorClass : normalClass}`}
          onChange={(e) => {
            const file = e.target.files[0];
            setQuestionPaper(file);
            if (file) {
              setErrors((prev) => ({ ...prev, questionPaper: "" })); // clear error if valid
            }
          }}
        />
        {errors.questionPaper && (
          <p className="requiredField">{errors.questionPaper}</p>
        )}
      </div>
    );

    if (type === 'AICSCC' || type === 'UPSC') {
      return (
        <>
          {questionInput}
          <div className="relative md:w-[49%] w-full">
            <label className='block mb-1 text-sm text-gray-700 font-medium'>
              Answer Keys
            </label>
            <input
              type="file"
              accept="application/pdf"
              className={`${baseClass} ${normalClass}`}
            />
          </div>
        </>
      );
    } else if (type === 'Test Series') {
      return (
        <>
          {questionInput}
          <div className="relative md:w-[49%] w-full">
            <label className='block mb-1 text-sm text-gray-700 font-medium'>
              Answer Keys
            </label>
            <input
              type="file"
              accept="application/pdf"
              className={`${baseClass} ${normalClass}`}
            />
          </div>
          <div className="relative md:w-[49%] w-full">
            <label className='block mb-1 text-sm text-gray-700 font-medium'>
              Answer Key with Explanation
            </label>
            <input
              type="file"
              accept="application/pdf"
              className={`${baseClass} ${normalClass}`}
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="absolute inset-0"
        onClick={() => setIsAddNewModalOpen(false)}
      />
      <div className="bg-white w-[90%] z-60 md:[80%] md:p-6 p-4 max-w-3xl relative shadow-xl animate-fadeIn rounded-md">
        <h2 className="text-lg font-semibold text-[#002147] mb-4">
          Add Question Bank
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap justify-between">
          {/* Type select */}
          <div className="relative md:w-[49%] w-full">
            <label className='block mb-1 text-sm text-gray-700 font-medium'>
              Select Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setErrors((prev) => ({ ...prev, type: "" })); // clear error
              }}
              className={`w-full border rounded-md p-2 outline-none appearance-none ${
                errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Type</option>
              <option value="AICSCC">AICSCC</option>
              <option value="UPSC">UPSC</option>
              <option value="Test Series">Test Series</option>
            </select>
            {errors.type && (
              <p className="requiredField">{errors.type}</p>
            )}
          </div>

          {/* Year input */}
          <div className='md:w-[49%] w-full'>
            <label className='block mb-1 text-sm text-gray-700 font-medium'>
              Year
            </label>
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setErrors((prev) => ({ ...prev, year: "" })); // clear error
              }}
              className={`w-full border rounded-md p-2 outline-none ${
                errors.year ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.year && (
              <p className="requiredField">{errors.year}</p>
            )}
          </div>

          {/* File Inputs */}
          {getFileInputs()}

          {/* Actions */}
          <div className="mt-4 w-[100%]">
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
