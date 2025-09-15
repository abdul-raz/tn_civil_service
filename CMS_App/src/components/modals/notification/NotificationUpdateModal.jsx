import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

const NotificationUpdateModal = ({ isUpdateModalOpen, setIsUpdateModalOpen, editDocument }) => {
  const [formData, setFormData] = useState({
    pathUrl: editDocument?.pathUrl || null,
    title: editDocument?.title || "",
    status: editDocument?.status || "",
    type: editDocument?.type || "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    if (isUpdateModalOpen) {
      setShowModal(true);
    }
  }, [isUpdateModalOpen]);

  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  
  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.status) newErrors.status = "Status is required";
    return newErrors;
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("Form Submitted ✅", formData);
    setIsUpdateModalOpen(false);
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
          Update Notification
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-wrap justify-between"
        >
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {errors.title && (
              <p className="requiredField">{errors.title}</p>
            )}
          </div>

          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none appearance-none"
            >
              <option value="">Select Category</option>
              <option value="Admission">Admission Information</option>
              <option value="Scholarship">Scholarship Notification</option>
              <option value="Tenders">Tenders</option>
              <option value="Others">Others</option>
            </select>
            {errors.type && (
              <p className="requiredField">{errors.type}</p>
            )}
          </div>

          <div className="relative md:w-[49%] w-full">
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
            {errors.status && (
              <p className="requiredField">{errors.status}</p>
            )}
          </div>

          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Upload Pdf
            </label>
            <input
              type="file"
              name="pathUrl"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {formData.pathUrl && typeof formData.pathUrl === "string" && (
              <p className="flex pl-2.5 mt-1 gap-2 items-center">
                Current file:{" "}
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
          onClick={() => setIsUpdateModalOpen(false)}
          className="absolute -top-3 -right-3 bg-white shadow-md hover:shadow-none rounded-md p-2 cursor-pointer text-gray-500 text-xl hover:translate-y-3 hover:-translate-x-3 transition-all duration-300"
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default NotificationUpdateModal;
