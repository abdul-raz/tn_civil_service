import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

const NotificationUpdateModal = ({
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  editDocument,
  fetchNotifications
}) => {
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    pathUrl: editDocument?.pathUrl || null,
    title: editDocument?.title || "",
    status: editDocument?.status || "",
    categoryTypeId: editDocument?.categoryTypeId || "", // selected category id
    file: null, // for new uploaded file
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [notificationTypes, setNotificationTypes] = useState([]); // state for dynamic options

  // Fetch notification types from backend
  const fetchNotificationTypes = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/masterData/notificationTypes`);
      if (res.ok) {
        const data = await res.json();
        setNotificationTypes(data); // expects array of {id, name}
      } else {
        console.error("Failed to fetch notification types");
      }
    } catch (error) {
      console.error("Error fetching notification types:", error);
    }
  };

  useEffect(() => {
    if (isUpdateModalOpen) {
      setFormData({
        pathUrl: editDocument?.pathUrl || null,
        title: editDocument?.title || "",
        status: editDocument?.status || "",
        categoryTypeId: editDocument?.categoryTypeId || "",
        file: null,
      });
      setErrors({});
      setShowModal(true);
      fetchNotificationTypes(); // fetch on open
    }
  }, [isUpdateModalOpen, editDocument]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({
        ...formData,
        file: files?.[0] || null,
      });
      setErrors({ ...errors, file: "" });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.categoryTypeId) newErrors.categoryTypeId = "Type is required";
    if (!formData.status) newErrors.status = "Status is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("categoryTypeId", formData.categoryTypeId);
      formDataObj.append("status", formData.status);
      if (formData.file) {
        formDataObj.append("file", formData.file);
      }

      const response = await fetch(
        `${backendUrl}/api/notification/${editDocument.id}`,
        {
          method: "PUT",
          body: formDataObj,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Notification updated successfully:", data);
        fetchNotifications();
        setIsUpdateModalOpen(false);
        // optionally refresh notification list via callback
      } else {
        console.error("Failed to update notification");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  if (!isUpdateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setIsUpdateModalOpen(false)}
      />
      <div
        className={`relative bg-white z-60 w-[90%] md:w-[80%] max-w-3xl p-4 md:p-6 rounded-md shadow-xl animate-fadeIn`}
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
              className={`w-full border rounded-md p-2 outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="requiredField">{errors.title}</p>}
          </div>

          <div className="relative md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Type
            </label>
            <select
              name="categoryTypeId"
              value={formData.categoryTypeId}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 outline-none appearance-none ${
                errors.categoryTypeId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              {notificationTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.categoryTypeId && (
              <p className="requiredField">{errors.categoryTypeId}</p>
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
              className={`w-full border rounded-md p-2 outline-none appearance-none ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <p className="requiredField">{errors.status}</p>}
          </div>

          <div className="md:w-[49%] w-full">
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Upload PDF (optional)
            </label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            />
            {formData.pathUrl && typeof formData.pathUrl === "string" && (
              <p className="flex pl-2.5 mt-1 gap-2 items-center">
                Current file:{" "}
                <a
                  href={`${window.location.origin}/${formData.pathUrl.replace(
                    /\\/g,
                    "/"
                  )}`}
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
