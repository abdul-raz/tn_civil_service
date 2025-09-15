import React, { useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import GalleryUpdateModal from '../components/modals/gallery/GalleryUpdateModal';
import GalleryUploadModal from '../components/modals/gallery/GalleryUploadModal';
import WarnModal from '../components/modals/WarnModal';

const Gallery = () => {
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editDocument, setEditDocument] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);


  // Example data for the gallery
  const galleryData = [
    { id: 1, imageUrl: '/poster.avif', title: 'State-of-the-Art Classrooms', category: 'cate 1', description: 'State-of-the-Art Classrooms Regular practice tests conducted in real examination conditions,', status: 'Active' },
    { id: 2, imageUrl: '/poster.avif', title: 'Mock Test Sessions', category: 'cate 2', description: 'Interview Training Regular practice tests conducted in real examination conditions', status: 'Inactive' },
    { id: 3, imageUrl: '/poster.avif', title: 'Interview Training', category: 'cate 3', description: 'Regular practice tests conducted in real examination conditions', status: 'Active' },
  ];

// Filtering the gallery data based on search query
const filteredGalleryData = galleryData.filter(item =>
  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.category.toLowerCase().includes(searchQuery.toLowerCase())
);


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
    <section className='bg-white  md:p-5 px-3 py-5 rounded-md shadow-md relative'>
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
              className='border  border-gray-300 rounded-md  px-4 py-2 ml-2 outline-none text-sm'
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
                <td colSpan="6" className="p-3 text-center text-red-500">No results found</td>
              </tr>
            ) : (
              filteredGalleryData.map((item, index) => {
                const isEven = index % 2 === 1;
                const rowBg = isEven ? 'bg-gray-100' : 'bg-white';
                const statusStyles = getStatusStyles(item.status);

                return (
                  <tr key={item.id} className={rowBg}>
                    <td className='p-3 text-center'>{index + 1}</td>
                    <td className='p-3 text-center'>{item.title}</td>
                    <td className='p-3 text-center'>{item.category}</td>

                    <td className='p-3 text-center'>{item.description}</td>
                    <td className='p-3 text-center'>
                      <img src={item.imageUrl} alt={item.title} className='w-16 h-16 mx-auto object-cover rounded-md' />
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
                        <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                          <FiEye className='cursor-pointer hover:text-blue-600' />
                        </a>
                        <FiEdit2 className='cursor-pointer hover:text-yellow-600' onClick={() => {
                          setEditDocument(item);
                          setIsUpdateModalOpen(true);
                        }} />
                        <RiDeleteBin6Line onClick={() => setIsWarnModalOpen(true)} className='cursor-pointer hover:text-red-600' />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {isAddNewModalOpen && <GalleryUploadModal setIsAddNewModalOpen={setIsAddNewModalOpen} />}
      {isUpdateModalOpen && <GalleryUpdateModal isUpdateModalOpen={isUpdateModalOpen} editDocument={editDocument} setIsUpdateModalOpen={setIsUpdateModalOpen} />}
      {isWarnModalOpen && <WarnModal isWarnModalOpen={isWarnModalOpen} setIsWarnModalOpen={setIsWarnModalOpen} />}
    </section>
  );
};

export default Gallery;
