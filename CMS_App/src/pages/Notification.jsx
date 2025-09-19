// import React, { useState } from 'react';
// import { IoMdAdd } from "react-icons/io";
// import { FiEye, FiEdit2 } from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import NotificationUploadModal from '../components/modals/notification/NotificationUploadModal'
// import NotificationUpdateModal from '../components/modals/notification/NotificationUpdateModal'
// import WarnModal from '../components/modals/WarnModal';

// const Notification = () => {
//   const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [editDocument, setEditDocument] = useState({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
  

//   const explanationData = [
//     { id: 1, title: 'Maths - Full Test', type: 'Scholarship Notification', status: 'Active', pathUrl: 'https://tnma.devops-in22labs.com/uploads/pdf/1744347042_87069e7d586ddf68bdbf.pdf' },
//     { id: 2, title: 'History - Mock Test', type: 'Tenders', status: 'Inactive', pathUrl: 'https://tnma.devops-in22labs.com/uploads/pdf/1744347042_87069e7d586ddf68bdbf.pdf' },
//     { id: 3, title: 'Science - Series Test', type: 'Others', status: 'Active', pathUrl: 'https://tnma.devops-in22labs.com/uploads/pdf/1744347042_87069e7d586ddf68bdbf.pdf' },
//   ];

//   // Filter
//   const filteredData = explanationData.filter(item =>
//     item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.type.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Status Style
//   const getStatusStyles = (status) => {
//     if (status === 'Active') {
//       return {
//         text: 'text-[#53d28c]',
//         bg: 'bg-[#dff7e9]',
//         border: 'border-[#53d28c]',
//       };
//     } else {
//       return {
//         text: 'text-[#d26d53]',
//         bg: 'bg-[#f7e9df]',
//         border: 'border-[#d26d53]',
//       };
//     }
//   };

//   return (
//     <section className='bg-white  md:p-5 px-3 py-5 rounded-md shadow-md relative'>
//       {/* Header */}
//       <div className='flex justify-between md:mb-5'>
//         <div className="space-y-4">
//           <h1 className='text-xl text-[#002147] font-bold'>Notification List</h1>
//         </div>
//         <div className='space-y-4 text-sm'>
//           <button
//             onClick={() => setIsAddNewModalOpen(true)}
//             className='flex ml-auto items-center gap-1 bg-[#002147] text-white rounded-md cursor-pointer px-4 py-2'
//           >
//             <IoMdAdd />
//             Add New
//           </button>
//           <div className='hidden md:block'>
//             Search:
//             <input
//               type="text"
//               className='border  border-gray-300 rounded-md  px-4 py-2 ml-2 outline-none text-sm'
//               placeholder='Search by Type...'
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on input change
//             />
//           </div>
//         </div>
//       </div>
//           <div className="md:hidden block mb-4">
//   <div className="flex items-center gap-2">
//     <span className="whitespace-nowrap">Search:</span>
//     <input
//       type="text"
//       className="border border-gray-300 rounded-md flex-1 px-4 py-2 outline-none text-sm"
//       placeholder="Search by Type..."
//       value={searchQuery}
//       onChange={(e) => setSearchQuery(e.target.value)}
//     />
//   </div>
// </div>

//       {/* Table */}
//       <div className="overflow-x-auto scrollbar-hide">

//       <table className='w-full border border-gray-300 rounded-md overflow-hidden'>
//         <thead>
//           <tr className='bg-[#002147] text-white text-center border-b-2 border-[#fab82b]'>
//             <th className='p-3'>S.No</th>
//             <th className='p-3'>Notification</th>
//             <th className='p-3'>Type</th>
//             <th className='p-3'>Status</th>
//             <th className='p-3'>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="p-3 text-center text-red-500">No results found</td>
//             </tr>
//           ) : (
//             filteredData.map((item, index) => {
//               const isEven = index % 2 === 1;
//               const rowBg = isEven ? 'bg-gray-300' : 'bg-white';
//               const statusStyles = getStatusStyles(item.status);

//               return (
//                 <tr key={item.id} className={rowBg}>
//                   <td className='p-3 text-center'>{index + 1}</td>
//                   <td className='p-3 text-center'>{item.title}</td>
//                   <td className='p-3 text-center'>{item.type}</td>
//                   <td className='p-3 text-center'>
//                     <span
//                       className={`rounded-sm px-2 py-0.5 border border-dashed ${statusStyles.text} ${statusStyles.bg} ${statusStyles.border}`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className='p-3 text-center'>
//                     <div className='flex justify-center gap-4 text-[#002147] text-lg'>
//                       <a href={item.pathUrl} target="_blank" rel="noopener noreferrer">
//                         <FiEye className='cursor-pointer hover:text-blue-600' />
//                       </a>
//                       <FiEdit2
//                         className='cursor-pointer hover:text-yellow-600'
//                         onClick={() => {
//                           setEditDocument(item);
//                           setIsUpdateModalOpen(true);
//                         }}
//                       />
//                       <RiDeleteBin6Line onClick={()=>setIsWarnModalOpen(true)} className='cursor-pointer hover:text-red-600' />
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//       </div>

//       {/* Modals */}
//       {isWarnModalOpen && <WarnModal isWarnModalOpen={isWarnModalOpen} setIsWarnModalOpen={setIsWarnModalOpen}/>}
//       {isAddNewModalOpen && <NotificationUploadModal setIsAddNewModalOpen={setIsAddNewModalOpen} />}
//       {isUpdateModalOpen && <NotificationUpdateModal isUpdateModalOpen={isUpdateModalOpen} editDocument={editDocument} setIsUpdateModalOpen={setIsUpdateModalOpen} documentName={"withexplanation"} />}
//     </section>
//   );
// };

// export default Notification;

// const Notification = () => {
//   const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [editDocument, setEditDocument] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   // New state to keep track of id to delete
//   const [deleteId, setDeleteId] = useState(null);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/api/notification");
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     }
//   };

//   // The delete handler function
//   const handleDelete = async () => {
//     if (!deleteId) return;
//     try {
//       await axios.delete(`http://localhost:3000/api/notification/${deleteId}`);
//       setIsWarnModalOpen(false);
//       setDeleteId(null);
//       // Refresh notifications list after delete
//       fetchNotifications();
//     } catch (error) {
//       console.error("Failed to delete notification:", error);
//     }
//   };


//   const filteredData = notifications.filter((item) => {
//     const titleMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
//     const categoryMatch = item.categoryType?.name?.toLowerCase().includes(searchQuery.toLowerCase());
//     return titleMatch || categoryMatch;
//   });

//   const getStatusStyles = (status) => {
//     if (status?.toLowerCase() === "active") {
//       return {
//         text: "text-[#53d28c]",
//         bg: "bg-[#dff7e9]",
//         border: "border-[#53d28c]",
//       };
//     } else {
//       return {
//         text: "text-[#d26d53]",
//         bg: "bg-[#f7e9df]",
//         border: "border-[#d26d53]",
//       };
//     }
//   };

//   return (
//     <section className="bg-white md:p-5 px-3 py-5 rounded-md shadow-md relative">
//       {/* Header */}
//       <div className="flex justify-between md:mb-5">
//         <div className="space-y-4">
//           <h1 className="text-xl text-[#002147] font-bold">Notification List</h1>
//         </div>
//         <div className="space-y-4 text-sm">
//           <button
//             onClick={() => setIsAddNewModalOpen(true)}
//             className="flex ml-auto items-center gap-1 bg-[#002147] text-white rounded-md cursor-pointer px-4 py-2"
//           >
//             <IoMdAdd />
//             Add New
//           </button>
//           <div className="hidden md:block">
//             Search:
//             <input
//               type="text"
//               className="border border-gray-300 rounded-md px-4 py-2 ml-2 outline-none text-sm"
//               placeholder="Search by Title or Category"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Mobile Search */}
//       <div className="md:hidden block mb-4">
//         <div className="flex items-center gap-2">
//           <span className="whitespace-nowrap">Search:</span>
//           <input
//             type="text"
//             className="border border-gray-300 rounded-md flex-1 px-4 py-2 outline-none text-sm"
//             placeholder="Search by Title or Category"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto scrollbar-hide">
//         <table className="w-full border border-gray-300 rounded-md overflow-hidden">
//           <thead>
//             <tr className="bg-[#002147] text-white text-center border-b-2 border-[#fabd2d]">
//               <th className="p-3">S.No</th>
//               <th className="p-3">Title</th>
//               <th className="p-3">Category</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="p-3 text-center text-red-500">
//                   No results found
//                 </td>
//               </tr>
//             ) : (
//               filteredData.map((item, index) => {
//                 const rowBg = index % 2 ? "bg-gray-100" : "bg-white";
//                 const statusStyles = getStatusStyles(item.status);
//                 return (
//                   <tr key={item.id} className={rowBg}>
//                     <td className="p-3 text-center">{index + 1}</td>
//                     <td className="p-3 text-center">{item.title}</td>
//                     <td className="p-3 text-center">{item.categoryType?.name}</td>
//                     <td className="p-3 text-center">
//                       <span
//                         className={`rounded-sm px-2 py-0.5 border border-dashed ${statusStyles.text} ${statusStyles.bg} ${statusStyles.border}`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="p-3 text-center">
//                       <div className="flex justify-center gap-4 text-[#002147] text-lg">
//                        <a
//   href={`${window.location.origin}/${item.pdfPath.replace(/\\/g, "/")}`}
//   target="_blank"
//   rel="noopener noreferrer"
// >
//   <FiEye className="cursor-pointer hover:text-blue-600" />
// </a>

//                         <FiEdit2
//                           onClick={() => {
//                             setEditDocument(item);
//                             setIsUpdateModalOpen(true);
//                           }}
//                           className="cursor-pointer hover:text-yellow-600"
//                         />
//                         <RiDeleteBinLine
//                           onClick={() => setIsWarnModalOpen(true)}
//                           className="cursor-pointer hover:text-red-600"
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modals */}
//       {isWarnModalOpen && <WarnModal isWarnModalOpen={isWarnModalOpen} setIsWarnModalOpen={setIsWarnModalOpen} />}
//       {isAddNewModalOpen && <NotificationUploadModal setIsAddNewModalOpen={setIsAddNewModalOpen} />}
//       {isUpdateModalOpen && (
//         <NotificationUpdateModal
//           isUpdateModalOpen={isUpdateModalOpen}
//           editDocument={editDocument}
//           setIsUpdateModalOpen={setIsUpdateModalOpen}
//           documentName="withexplanation"
//         />
//       )}
//     </section>
//   );
// };

// export default Notification;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import NotificationUploadModal from "../components/modals/notification/NotificationUploadModal";
import NotificationUpdateModal from "../components/modals/notification/NotificationUpdateModal";
import WarnModal from "../components/modals/WarnModal";

const Notification = () => {
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editDocument, setEditDocument] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [deleteId, setDeleteId] = useState(null); // Track ID to delete

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/notification");
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:3000/api/notification/${deleteId}`);
      setIsWarnModalOpen(false);
      setDeleteId(null);
      fetchNotifications(); // Refresh after delete
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const filteredData = notifications.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = item.categoryType?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || categoryMatch;
  });

  const getStatusStyles = (status) => {
    if (status?.toLowerCase() === "active") {
      return {
        text: "text-[#53d28c]",
        bg: "bg-[#dff7e9]",
        border: "border-[#53d28c]",
      };
    } else {
      return {
        text: "text-[#d26d53]",
        bg: "bg-[#f7e9df]",
        border: "border-[#d26d53]",
      };
    }
  };

  return (
    <section className="bg-white md:p-5 px-3 py-5 rounded-md shadow-md relative">
      {/* Header */}
      <div className="flex justify-between md:mb-5">
        <div className="space-y-4">
          <h1 className="text-xl text-[#002147] font-bold">Notification List</h1>
        </div>
        <div className="space-y-4 text-sm">
          <button
            onClick={() => setIsAddNewModalOpen(true)}
            className="flex ml-auto items-center gap-1 bg-[#002147] text-white rounded-md cursor-pointer px-4 py-2"
          >
            <IoMdAdd />
            Add New
          </button>
          <div className="hidden md:block">
            Search:
            <input
              type="text"
              className="border border-gray-300 rounded-md px-4 py-2 ml-2 outline-none text-sm"
              placeholder="Search by Title or Category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden block mb-4">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Search:</span>
          <input
            type="text"
            className="border border-gray-300 rounded-md flex-1 px-4 py-2 outline-none text-sm"
            placeholder="Search by Title or Category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-[#002147] text-white text-center border-b-2 border-[#fabd2d]">
              <th className="p-3">S.No</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-red-500">
                  No results found
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => {
                const rowBg = index % 2 ? "bg-gray-100" : "bg-white";
                const statusStyles = getStatusStyles(item.status);
                return (
                  <tr key={item.id} className={rowBg}>
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{item.title}</td>
                    <td className="p-3 text-center">{item.categoryType?.name}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`rounded-sm px-2 py-0.5 border border-dashed ${statusStyles.text} ${statusStyles.bg} ${statusStyles.border}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-4 text-[#002147] text-lg">
                       <a
  href={`http://localhost:3000/${item.pdfPath.replace(/\\/g, "/")}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <FiEye className="cursor-pointer hover:text-blue-600" />
</a>


                        <FiEdit2
                          onClick={() => {
                            setEditDocument(item);
                            setIsUpdateModalOpen(true);
                          }}
                          className="cursor-pointer hover:text-yellow-600"
                        />

                        <RiDeleteBinLine
                          onClick={() => {
                            setDeleteId(item.id);
                            setIsWarnModalOpen(true);
                          }}
                          className="cursor-pointer hover:text-red-600"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isWarnModalOpen && (
        <WarnModal
          isWarnModalOpen={isWarnModalOpen}
          setIsWarnModalOpen={setIsWarnModalOpen}
          onConfirm={handleDelete}
        />
      )}

      {isAddNewModalOpen && <NotificationUploadModal setIsAddNewModalOpen={setIsAddNewModalOpen} />}

      {isUpdateModalOpen && (
        <NotificationUpdateModal
          isUpdateModalOpen={isUpdateModalOpen}
          editDocument={editDocument}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          documentName="withexplanation"
        />
      )}
    </section>
  );
};

export default Notification;

