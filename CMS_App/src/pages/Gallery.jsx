import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdAdd } from "react-icons/io";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import GalleryUpdateModal from '../components/modals/gallery/GalleryUpdateModal';
import GalleryUploadModal from '../components/modals/gallery/GalleryUploadModal';
import WarnModal from '../components/modals/WarnModal';

const Gallery = () => {
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const [galleryData, setGalleryData] = useState([]);
  // Fetch gallery data
const fetchGalleryData = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/gallery`, { withCredentials: true });
    
    // Ensure galleryData is always an array
    const data = Array.isArray(res.data) ? res.data : [];
    setGalleryData(data);

    console.log(data);
  } catch (error) {
    console.error("Error fetching gallery data:", error.response?.data || error.message);
    setGalleryData([]); // fallback to empty array
  }
};

  // 🔹 Fetch categories on mount
  const [categories, setCategories] = useState([]);
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/masterData/galleryCategories`, {
        withCredentials: true,
      });
      // Ensure categories is always an array
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // fallback to empty array
    }
  };
  fetchCategories();
}, []);


  
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editDocument, setEditDocument] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // Track item to delete
  


  useEffect(() => {
    fetchGalleryData();
  }, []);

  // Delete gallery function
const handleDeleteGallery = async () => {
  if (!deleteId) return;

  try {
    const res = await axios.delete(`${backendUrl}/api/gallery/${deleteId}`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      // Refresh gallery data from backend after successful delete
      fetchGalleryData();
    } else {
      alert(res.data?.message || "Failed to delete.");
    }
  } catch (error) {
    console.error("Error deleting gallery:", error);
    alert(error.response?.data?.message || "Server error while deleting.");
  } finally {
    setIsWarnModalOpen(false);
    setDeleteId(null);
  }
};


  // Filter gallery data based on search query
const filteredGalleryData = (galleryData || []).filter(item => {
  const title = item.title?.toLowerCase() || '';
  const category = item.category?.name?.toLowerCase() || '';
  const query = searchQuery.toLowerCase();
  return title.includes(query) || category.includes(query);
});


  // Status styling
  const getStatusStyles = (status) => {
    if (status === 'Active') {
      return {
        text: 'text-[#53d28c]',
        bg: 'bg-[#dff7e9]',
        border: 'border-[#53d28c]',
      };
    } else {
      return {
        text: 'text-[#d26d53]',
        bg: 'bg-[#f7e9df]',
        border: 'border-[#d26d53]',
      };
    }
  };

  return (
    <section className='bg-white md:p-5 px-3 py-5 rounded-md shadow-md relative'>
      {/* Header */}
      <div className='flex justify-between md:mb-5'>
        <h1 className='text-xl text-[#002147] font-bold'>Galleries List</h1>
        <div className='space-y-4 text-sm'>
          <button
            onClick={() => setIsAddNewModalOpen(true)}
            className='flex ml-auto cursor-pointer items-center gap-1 bg-[#002147] text-white rounded-md px-4 py-2'
          >
            <IoMdAdd />
            Add New
          </button>
          <div className='hidden md:block'>
            Search:
            <input
              type="text"
              className='border border-gray-300 rounded-md px-4 py-2 ml-2 outline-none text-sm'
              placeholder='Search by Title or Category...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="md:hidden block mb-4">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Search:</span>
          <input
            type="text"
            className="border border-gray-300 rounded-md flex-1 px-4 py-2 outline-none text-sm"
            placeholder='Search by Title or Category...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className='w-full border border-gray-300 rounded-md overflow-hidden'>
          <thead>
            <tr className='bg-[#002147] text-white text-center border-b-2 border-[#fab82b]'>
              <th className='p-3'>S.No</th>
              <th className='p-3'>Title</th>
              <th className='p-3'>Category</th>
              <th className='p-3'>Description</th>
              <th className='p-3'>Image</th>
              <th className='p-3'>Status</th>
              <th className='p-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGalleryData.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center text-red-500">No results found</td>
              </tr>
            ) : (
              filteredGalleryData.map((item, index) => {
                const isEven = index % 2 === 1;
                const rowBg = isEven ? 'bg-gray-300' : 'bg-white';
                const statusStyles = getStatusStyles(item.status || 'Inactive');

                return (
                  <tr key={item.id} className={rowBg}>
                    <td className='p-3 text-center'>{index + 1}</td>
                    <td className='p-3 text-center'>{item.title}</td>
                    <td className='p-3 text-center'>{item.category?.name || '-'}</td>
                    <td className='p-3 text-center'>{item.description}</td>
                    <td className='p-3 text-center'>
                      <img
                        src={`${backendUrl}/${item.imageUrl.replace(/\\/g, "/")}`}
                        alt={item.title}
                        className='w-16 h-16 mx-auto object-cover rounded-md'
                      />
                    </td>
                    <td className='p-3 text-center'>
                      <span
                        className={`rounded-sm px-2 py-0.5 border border-dashed ${statusStyles.text} ${statusStyles.bg} ${statusStyles.border}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className='p-3 text-center'>
                      <div className='flex justify-center gap-4 text-[#002147] text-lg'>
                       <div className="relative group">
                         <a href={`${backendUrl}/${item.imageUrl.replace(/\\/g, "/")}`} target="_blank" rel="noopener noreferrer">
                          <FiEye className='cursor-pointer hover:text-blue-600' />
                        </a>
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform text-gray-800 border-gray-800 border-1 bg-white text-xs px-2 py-1 rounded">
                            View
                          </span>
                       </div>
                       <div className="relative group">
                         <FiEdit2
                          className='cursor-pointer hover:text-yellow-600'
                          onClick={() => {
                            setEditDocument(item);
                            setIsUpdateModalOpen(true);
                          }}
                        />
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform text-gray-800 border-gray-800 border-1 bg-white text-xs px-2 py-1 rounded">
                            Edit
                          </span>
                       </div>
                       <div className="relative group">
                         <RiDeleteBin6Line
                          onClick={() => {
                            setDeleteId(item.id);
                            setIsWarnModalOpen(true);
                          }}
                          className='cursor-pointer hover:text-red-600'
                        />
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform text-gray-800 border-gray-800 border-1 bg-white text-xs px-2 py-1 rounded">
                            Delete
                          </span>
                       </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isAddNewModalOpen && <GalleryUploadModal fetchGalleryData={fetchGalleryData} categories={categories} setIsAddNewModalOpen={setIsAddNewModalOpen} />}
      {isUpdateModalOpen && <GalleryUpdateModal fetchGalleryData={fetchGalleryData} categories={categories} isUpdateModalOpen={isUpdateModalOpen} editDocument={editDocument} setIsUpdateModalOpen={setIsUpdateModalOpen} />}
      {isWarnModalOpen && (
        <WarnModal
          isWarnModalOpen={isWarnModalOpen}
          setIsWarnModalOpen={setIsWarnModalOpen}
          onConfirm={handleDeleteGallery} // Confirm deletion
        />
      )}
    </section>
  );
};

export default Gallery;
