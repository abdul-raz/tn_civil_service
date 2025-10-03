// import React, { useState, useEffect } from "react";
// import { IoCloseSharp } from "react-icons/io5";
// import axios from "axios";

// const ResultUploadModal = ({
//   setIsAddNewModalOpen,
//   types,
//   years,
//   onSuccess,
//   baseUrl = import.meta.env.VITE_REACT_APP_API_BACKEND_URL,
// }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     typeId: "",
//     year: "",
//     status: "1", // "1" for Active by default (string)
//     file: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [submitError, setSubmitError] = useState("");

//   useEffect(() => {
//     setFormData({
//       title: "",
//       typeId: "",
//       year: "",
//       status: "1",
//       file: null,
//     });
//     setErrors({});
//     setSubmitError("");
//   }, [setIsAddNewModalOpen]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "file") {
//       setFormData((prev) => ({ ...prev, file: files?.[0] || null }));
//       setErrors((prev) => ({ ...prev, file: "" }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title) newErrors.title = "Title is required";
//     if (!formData.typeId) newErrors.typeId = "Type is required";
//     if (!formData.year) newErrors.year = "Year is required";
//     if (!formData.status) newErrors.status = "Status is required";
//     if (!formData.file) newErrors.file = "PDF file is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitError("");
//     if (!validateForm()) return;

//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("typeId", formData.typeId);
//     data.append("year", formData.year);
//     data.append("status", Number(formData.status)); // convert string to number
//     data.append("file", formData.file);

//     try {
//       await axios.post(`${baseUrl}/api/result`, data, {
//         withCredentials: true,
//       });
//       setIsAddNewModalOpen(false);
//       onSuccess();
//     } catch (error) {
//       console.error("Axios error:", error);
//       setSubmitError(error.message || "Failed to create result");
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
//       onClick={() => setIsAddNewModalOpen(false)}
//     >
//       <div
//         className="bg-white z-50 w-[90%] md:w-[80%] p-6 max-w-3xl rounded-md shadow-xl relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-[#002147]">
//             Add New Result
//           </h2>
//           <button
//             onClick={() => setIsAddNewModalOpen(false)}
//             className="absolute -top-3 -right-3 bg-white shadow-md hover:shadow-none rounded-md p-2 cursor-pointer text-gray-500 text-xl hover:translate-y-3 hover:-translate-x-3 transition-all duration-300"
//           >
//             <IoCloseSharp size={24} />
//           </button>
//         </div>

//         {submitError && <p className="text-red-600 mb-3">{submitError}</p>}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4 flex flex-wrap justify-between"
//         >
//           {/* Title */}
//           <div className="md:w-[49%] w-full">
//             <label className="block mb-1 text-gray-700 font-medium">
//               Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               placeholder="title"
//               value={formData.title}
//               onChange={handleChange}
//               className={`w-full border p-2 rounded-md outline-none ${
//                 errors.title ? "border-red-600" : "border-gray-300"
//               }`}
//             />
//             {errors.title && (
//               <p className="text-red-600 mt-1">{errors.title}</p>
//             )}
//           </div>

//           {/* Type */}
//           <div className="md:w-[49%] w-full">
//             <label className="block mb-1 text-gray-700 font-medium">Type</label>
//             <select
//               name="typeId"
//               value={formData.typeId}
//               onChange={handleChange}
//               className={`w-full border p-2 rounded-md outline-none ${
//                 errors.typeId ? "border-red-600" : "border-gray-300"
//               }`}
//             >
//               <option value="">Select Type</option>
//               {types.map((t) => (
//                 <option key={t.id} value={t.id}>
//                   {t.name}
//                 </option>
//               ))}
//             </select>
//             {errors.typeId && (
//               <p className="text-red-600 mt-1">{errors.typeId}</p>
//             )}
//           </div>

//           {/* Year */}
//           <div className="md:w-[49%] w-full">
//             <label className="block mb-1 text-gray-700 font-medium">Year</label>
//             <select
//               name="year"
//               value={formData.year}
//               onChange={handleChange}
//               className={`w-full border p-2 rounded-md outline-none ${
//                 errors.year ? "border-red-600" : "border-gray-300"
//               }`}
//             >
//               <option value="">Select Year</option>
//               {years.map((y) => (
//                 <option key={y.id} value={y.name}>
//                   {y.name}
//                 </option>
//               ))}
//             </select>
//             {errors.year && <p className="text-red-600 mt-1">{errors.year}</p>}
//           </div>

//           {/* Status */}
//           <div className="md:w-[49%] w-full">
//             <label className="block mb-1 text-gray-700 font-medium">
//               Status
//             </label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className={`w-full border p-2 rounded-md outline-none ${
//                 errors.status ? "border-red-600" : "border-gray-300"
//               }`}
//             >
//               <option value="0">Inactive</option>
//               <option value="1">Active</option>
//             </select>
//             {errors.status && (
//               <p className="text-red-600 mt-1">{errors.status}</p>
//             )}
//           </div>

//           {/* PDF Upload */}
//           <div className="md:w-[49%] w-full">
//             <label className="block mb-1 text-gray-700 font-medium">
//               Upload PDF
//             </label>
//             <input
//               type="file"
//               name="file"
//               accept="application/pdf"
//               onChange={handleChange}
//               className={`w-full border p-2 rounded-md cursor-pointer ${
//                 errors.file ? "border-red-600" : "border-gray-300"
//               }`}
//             />
//             {errors.file && <p className="text-red-600 mt-1">{errors.file}</p>}
//           </div>

//           {/* Submit Button */}
//           <div className="w-full mt-4">
//             <button
//               type="submit"
//               className="w-full bg-[#002147] text-white p-2 rounded-md hover:bg-[#013168]"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResultUploadModal;


import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";

const ResultUploadModal = ({
  setIsAddNewModalOpen,
  types,
  years,
  onSuccess,
  baseUrl = import.meta.env.VITE_REACT_APP_API_BACKEND_URL,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    typeId: "",
    year: "",
    status: "0", // "0" (Inactive) as default—no UI
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setFormData({
      title: "",
      typeId: "",
      year: "",
      status: "0", // Reset to Inactive by default
      file: null,
    });
    setErrors({});
    setSubmitError("");
  }, [setIsAddNewModalOpen]);

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
    data.append("status", Number(formData.status)); // Always "0" (Inactive)
    data.append("file", formData.file);

    try {
      await axios.post(`${baseUrl}/api/result`, data, {
        withCredentials: true,
      });
      setIsAddNewModalOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Axios error:", error);
      setSubmitError(error.message || "Failed to create result");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => setIsAddNewModalOpen(false)}
    >
      <div
        className="bg-white z-50 w-[90%] md:w-[80%] p-6 max-w-3xl rounded-md shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#002147]">
            Add New Result
          </h2>
          <button
            onClick={() => setIsAddNewModalOpen(false)}
            className="absolute -top-3 -right-3 bg-white shadow-md hover:shadow-none rounded-md p-2 cursor-pointer text-gray-500 text-xl hover:translate-y-3 hover:-translate-x-3 transition-all duration-300"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        {submitError && <p className="text-red-600 mb-3">{submitError}</p>}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-wrap justify-between"
        >
          {/* Title */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="title"
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
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Type</label>
            <select
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md outline-none ${
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
            {errors.typeId && (
              <p className="text-red-600 mt-1">{errors.typeId}</p>
            )}
          </div>

          {/* Year */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full border p-2 rounded-md outline-none ${
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
            {errors.year && <p className="text-red-600 mt-1">{errors.year}</p>}
          </div>

          {/* PDF Upload */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-gray-700 font-medium">
              Upload PDF
            </label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className={`w-full border p-2 rounded-md cursor-pointer ${
                errors.file ? "border-red-600" : "border-gray-300"
              }`}
            />
            {errors.file && <p className="text-red-600 mt-1">{errors.file}</p>}
          </div>

          {/* Submit Button */}
          <div className="w-full mt-4">
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

export default ResultUploadModal;

