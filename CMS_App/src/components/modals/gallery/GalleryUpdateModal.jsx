import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const GalleryUpdateModal = ({
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  editDocument,
}) => {
  const [formData, setFormData] = useState({
    imageUrl: editDocument?.imageUrl || null,
    title: editDocument?.title || "",
    status: editDocument?.status || "",
    description: editDocument?.description || "",
    category: editDocument?.category || "",
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isUpdateModalOpen) {
      setAnimate(true);
    } else {
      const timer = setTimeout(() => setAnimate(false), 400); 
      return () => clearTimeout(timer);
    }
  }, [isUpdateModalOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files?.[0];
      setFormData({ ...formData, imageUrl: file || null });
      setErrors({ ...errors, image: "" });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.imageUrl) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      setIsUpdateModalOpen(false);
    }
  };

  if (!isUpdateModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => setIsUpdateModalOpen(false)}
    >
      <div
        className={`bg-white z-50 w-[90%] md:w-[80%] md:p-6 p-4 max-w-3xl relative shadow-xl rounded-md
          transform transition-all duration-500 ease-in-out
          ${isUpdateModalOpen ? "translate-y-0 opacity-100" : "-translate-y-96 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#002147] mb-4">
          Update Question Bank
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
              className={`w-full border rounded-md p-2 outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="requiredField">{errors.title}</p>
            )}
          </div>

          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none appearance-none ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              <option value="cate 1">cate 1</option>
              <option value="cate 2">cate 2</option>
              <option value="cate 3">cate 3</option>
            </select>
            {errors.category && (
              <p className="requiredField">{errors.category}</p>
            )}
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
              className={`w-full border rounded-md p-2 outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="requiredField">
                {errors.description}
              </p>
            )}
          </div>

          <div className="relative md:w-[49%] w-[100%]">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none appearance-none ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
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
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.image && (
              <p className="requiredField">{errors.image}</p>
            )}

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-md border"
              />
            )}

            {editDocument?.imageUrl && !preview && (
              <p className="flex pl-2.5 mt-1 gap-2 items-center">
                <label>Current Image:</label>
                <a
                  href={editDocument.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 w-fit gap-1"
                >
                  View Image
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

export default GalleryUpdateModal;
