import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";

const GalleryUploadModal = ({ setIsAddNewModalOpen }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.image) newErrors.image = "Image is required.";
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
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="absolute inset-0"
        onClick={() => setIsAddNewModalOpen(false)}
      />
      <div className="bg-white z-60 w-[90%] md:[80%] md:p-6 p-4 max-w-3xl relative shadow-xl animate-fadeIn rounded-md">
        <h2 className="text-lg font-semibold text-[#002147] mb-4">
          Add in the Gallery
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap justify-between">
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
            {errors.title && <p className="requiredField">{errors.title}</p>}
          </div>

          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none appearance-none"
            >
              <option value="">Select Category</option>
              <option value="AICSCC">cate 1</option>
              <option value="UPSC">cate 2</option>
              <option value="Test Series">cate 3</option>
            </select>
            {errors.category && <p className="requiredField">{errors.category}</p>}
          </div>

          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {errors.description && <p className="requiredField">{errors.description}</p>}
          </div>

          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {errors.image && <p className="requiredField">{errors.image}</p>}
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

export default GalleryUploadModal;
