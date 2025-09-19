// import React, { useState } from "react";
// import { IoCloseSharp } from "react-icons/io5";

// const NotificationUploadModal = ({ setIsAddNewModalOpen }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     type: "",
//     file: null,
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "file") {
//       setFormData({ ...formData, file: files?.[0] || null });
//       setErrors({ ...errors, file: "" });
//     } else {
//       setFormData({ ...formData, [name]: value });
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     if (!formData.type) newErrors.type = "Type is required";
//     if (!formData.file) newErrors.file = "PDF is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   console.log("Submit clicked, validating form...");
//   if (validateForm()) {
//     console.log("Form is valid. FormData:", formData);
//     try {
//       const formDataObj = new FormData();
//       formDataObj.append("title", formData.title);
//       formDataObj.append("categoryTypeId", formData.type);
//       formDataObj.append("file", formData.file);

//       console.log("Sending form data to backend...");
//       const response = await fetch("http://localhost:3000/api/notification", {
//         method: "POST",
//         body: formDataObj,
//       });

//       console.log("Response status:", response.status);
//       if (response.ok) {
//         const data = await response.json();
//         console.log("Notification created successfully:", data);
//         setIsAddNewModalOpen(false);
//       } else {
//         console.error("Failed to create notification");
//       }
//     } catch (error) {
//       console.error("Error uploading notification:", error);
//     }
//   } else {
//     console.log("Form validation failed. Errors:", errors);
//   }
// };


//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//       <div className="absolute inset-0" onClick={() => setIsAddNewModalOpen(false)} />
//       <div className="bg-white w-[90%] z-60 md:w-[80%] md:p-6 p-4 max-w-3xl relative shadow-xl animate-fadeIn rounded-md">
//         <h2 className="text-lg font-semibold text-[#002147] mb-4">Add in the Gallery</h2>

//         <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap justify-between">
//           <div className="md:w-[49%] w-full">
//             <label className="block mb-1 text-sm text-gray-700 font-medium">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               placeholder="Title"
//               className={`w-full border rounded-md p-2 outline-none ${
//                 errors.title ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.title && <p className="requiredField">{errors.title}</p>}
//           </div>

//           <div className="relative md:w-[49%] w-full">
//             <label className="block mb-1 text-sm text-gray-700 font-medium">Type</label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className={`w-full border rounded-md p-2 outline-none appearance-none ${
//                 errors.type ? "border-red-500" : "border-gray-300"
//               }`}
//             >
//               <option value="">Select Category</option>
//               <option value="Admission">Admission Information</option>
//               <option value="Scholarship">Scholarship Notification</option>
//               <option value="Tenders">Tenders</option>
//               <option value="Others">Others</option>
//             </select>
//             {errors.type && <p className="requiredField">{errors.type}</p>}
//           </div>

//           <div className="md:w-[49%] w-full">
//             <label className="block mb-1 text-sm text-gray-700 font-medium">Upload PDF</label>
//             <input
//               type="file"
//               name="file"
//               accept="application/pdf"
//               onChange={handleChange}
//               className={`w-full border rounded-md p-2 outline-none ${
//                 errors.file ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.file && <p className="requiredField">{errors.file}</p>}
//           </div>

//           <div className="mt-4 w-full">
//             <button
//               type="submit"
//               className="px-4 font-medium cursor-pointer py-2 w-full bg-[#002147] hover:bg-[#013168] text-white rounded-md"
//             >
//               Save
//             </button>
//           </div>
//         </form>

//         <button
//           onClick={() => setIsAddNewModalOpen(false)}
//           className="absolute -top-3 -right-3 bg-white shadow-md hover:shadow-none rounded-md p-2 cursor-pointer text-gray-500 text-xl hover:translate-y-3 hover:-translate-x-3 transition-all duration-300"
//         >
//           <IoCloseSharp />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NotificationUploadModal;
import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

const NotificationUploadModal = ({ setIsAddNewModalOpen }) => {
  const [formData, setFormData] = useState({
    title: "",
    categoryTypeId: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [examTypes, setExamTypes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/masterData/notificationTypes")
      .then(res => res.json())
      .then(data => setExamTypes(data))
      .catch(err => console.error("Failed to fetch exam types", err));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files?.[0] || null });
      setErrors({ ...errors, file: "" });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.categoryTypeId) newErrors.categoryTypeId = "Type is required";
    if (!formData.file) newErrors.file = "PDF is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataObj = new FormData();
        formDataObj.append("title", formData.title);
        formDataObj.append("categoryTypeId", formData.categoryTypeId);
        formDataObj.append("file", formData.file);

        const response = await fetch("http://localhost:3000/api/notification", {
          method: "POST",
          body: formDataObj,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Notification created successfully:", data);
          setIsAddNewModalOpen(false);
        } else {
          console.error("Failed to create notification");
        }
      } catch (error) {
        console.error("Error uploading notification:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="absolute inset-0" onClick={() => setIsAddNewModalOpen(false)} />
      <div className="bg-white w-[90%] z-60 md:w-[80%] md:p-6 p-4 max-w-3xl relative shadow-xl animate-fadeIn rounded-md">
        <h2 className="text-lg font-semibold text-[#002147] mb-4">Add Notification</h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap justify-between">
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className={`w-full border rounded-md p-2 outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="requiredField">{errors.title}</p>}
          </div>

          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Type</label>
            <select
              name="categoryTypeId"
              value={formData.categoryTypeId}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none appearance-none ${
                errors.categoryTypeId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              {examTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.categoryTypeId && <p className="requiredField">{errors.categoryTypeId}</p>}
          </div>

          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Upload PDF</label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none ${
                errors.file ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.file && <p className="requiredField">{errors.file}</p>}
          </div>

          <div className="mt-4 w-full">
            <button
              type="submit"
              className="px-4 font-medium cursor-pointer py-2 w-full bg-[#002147] hover:bg-[#013168] text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>

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

export default NotificationUploadModal;
