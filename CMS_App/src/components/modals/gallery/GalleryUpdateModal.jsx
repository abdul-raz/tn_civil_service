
import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";

const GalleryUpdateModal = ({
  fetchGalleryData,
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  editDocument,
  categories,
}) => {
  const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    title: editDocument?.title || "",
    status: editDocument?.status || "Inactive",
    description: editDocument?.description || "",
    category: editDocument?.category?.id || "", // store category id
    imageUrl: null, // new field for uploaded image file
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isUpdateModalOpen) {
      setAnimate(true);
      setFormData({
        title: editDocument?.title || "",
        status: editDocument?.status || "Inactive",
        description: editDocument?.description || "",
        category: editDocument?.category?.id || "",
        imageUrl: null, // reset image on modal open
      });
      setPreview(null);
    } else {
      const timer = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isUpdateModalOpen, editDocument]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files?.[0];
      setFormData((prev) => ({ ...prev, imageUrl: file || null }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("status", formData.status);
      data.append("categoryId", formData.category);
      if (formData.imageUrl) {
        data.append("image", formData.imageUrl);
      }

      const res = await axios.put(
        `${baseUrl}/api/gallery/${editDocument.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Gallery updated:", res.data);
      setIsUpdateModalOpen(false);
      fetchGalleryData();
    } catch (error) {
      console.error("Error updating gallery:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update gallery.");
    }
  };

  if (!isUpdateModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => setIsUpdateModalOpen(false)}
    >
      <div
        className={`bg-white z-50 w-[90%] md:w-[80%] p-6 max-w-3xl relative shadow-xl rounded-md
          transform transition-all duration-500 ease-in-out
          ${isUpdateModalOpen ? "translate-y-0 opacity-100" : "-translate-y-96 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#002147] mb-4">Update Gallery</h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-wrap justify-between">
          {/* Title */}
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

          {/* Category */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none appearance-none ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="requiredField">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Description</label>
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
            {errors.description && <p className="requiredField">{errors.description}</p>}
          </div>

          {/* Status */}
          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Status</label>
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
            {errors.status && <p className="requiredField">{errors.status}</p>}
          </div>

          {/* Image Upload */}
          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-md border"
              />
            )}
            {!preview && editDocument?.imageUrl && (
              <p className="flex pl-2.5 mt-1 gap-2 items-center">
                <label>Current Image:</label>
                <a
                  href={`${baseUrl}/${editDocument.imageUrl.replace(/\\/g, "/")}`}
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
