// import React, { useState, useEffect } from 'react';
// import { IoMdAdd } from "react-icons/io";
// import { FiEye, FiEdit2 } from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import ResultUploadModal from '../components/modals/result/ResultUploadModal';
// import ResultUpdateModal from '../components/modals/result/ResultUpdateModal';
// import WarnModal from '../components/modals/WarnModal';
// import axios from "axios";

// const Result = () => {
//   const baseUrl = "http://localhost:3000"; // base URL
//   const [resultData, setResultData] = useState([]);
//   const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
//   const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [editDocument, setEditDocument] = useState({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [types, setTypes] = useState([]);
//   const [deleteId, setDeleteId] = useState(null); // to hold id for delete

//   // Fetch types on mount
//   useEffect(() => {
//     const fetchTypes = async () => {
//       try {
//         const res = await axios.get(`${baseUrl}/api/masterData/processDocumentTypes`, { withCredentials: true });
//         setTypes(res.data);
//       } catch (error) {
//         console.error("Error fetching result types:", error);
//       }
//     };
//     fetchTypes();
//   }, []);

//   // Fetch all results
//   useEffect(() => {
//     fetchResults();
//   }, []);

//   const fetchResults = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/api/result`, { withCredentials: true });
//       setResultData(res.data);
//     } catch (error) {
//       alert(error.response?.data?.message || "Error loading results");
//     }
//   };

//   // Delete handler
//   const handleDelete = async () => {
//     try {
//       const res = await axios.delete(`${baseUrl}/api/results/${deleteId}`, { withCredentials: true });
//       if (res.status === 200) {
//         fetchResults();
//       } else {
//         alert(res.data.message || "Delete failed");
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Server error during delete");
//     } finally {
//       setIsWarnModalOpen(false);
//       setDeleteId(null);
//     }
//   };

//   // Filter by name or type or year
//   const filteredData = resultData.filter((item) => {
//     const lowerQuery = searchQuery.toLowerCase();
//     const typeName = types.find(t => t.id === item.typeId)?.name || "";
//     return (
//       (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
//       (typeName.toLowerCase().includes(lowerQuery)) ||
//       (item.year && item.year.toLowerCase().includes(lowerQuery))
//     );
//   });

//   const getStatusStyles = (status) => {
//     if (status === "Active") {
//       return { text: "text-[#53d28c]", bg: "bg-[#dff7e9]", border: "border-[#53d28c]" };
//     } else {
//       return { text: "text-[#d26d53]", bg: "bg-[#f7e9df]", border: "border-[#d26d53]" };
//     }
//   };

//   return (
//     <section className="bg-white md:p-5 px-3 py-5 rounded-md shadow-md relative">
//       {/* Header */}
//       <div className="flex justify-between md:mb-5">
//         <h1 className="text-xl text-[#002147] font-bold">Result List</h1>
//         {/* Add and Search */}
//         <div className="space-y-4 text-sm flex items-center gap-4">
//           <button
//             className="flex items-center gap-1 bg-[#002147] text-white rounded-md px-4 py-2 cursor-pointer"
//             onClick={() => setIsAddNewModalOpen(true)}
//           >
//             <IoMdAdd /> Add New
//           </button>
//           <div className="hidden md:block">
//             Search:{" "}
//             <input
//               type="text"
//               className="border border-gray-300 rounded-md px-4 py-2 ml-2 outline-none text-sm"
//               placeholder="Search by Name, Type or Year"
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
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
//             placeholder="Search by Name, Type or Year"
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto scrollbar-hide">
//         <table className="w-full border border-gray-300 rounded-md overflow-hidden text-sm md:text-base">
//           <thead>
//             <tr className="bg-[#002147] text-white text-center border-b-2 border-[#fab82b]">
//               <th className="p-3">S.No</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Type</th>
//               <th className="p-3">Year</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="p-3 text-center text-red-500">No results found</td>
//               </tr>
//             ) : (
//               filteredData.map((item, index) => {
//                 const rowBg = index % 2 ? "bg-gray-100" : "bg-white";
//                 const typeName = types.find(t => t.id === item.typeId)?.name || "Unknown";
//                 const statusStyles = getStatusStyles(item.status || "");
//                 return (
//                   <tr key={item.id} className={rowBg}>
//                     <td className="p-3 text-center">{index + 1}</td>
//                     <td className="p-3 text-center">{item.name || "-"}</td>
//                     <td className="p-3 text-center">{typeName}</td>
//                     <td className="p-3 text-center">{item.year || "-"}</td>
//                     <td className="p-3 text-center">
//                       <span className={`rounded-sm px-2 py-0.5 border border-dashed ${statusStyles.text} ${statusStyles.bg} ${statusStyles.border}`}>
//                         {item.status || "-"}
//                       </span>
//                     </td>
//                     <td className="p-3 text-center">
//                       <div className="flex justify-center gap-4 text-[#002147] text-lg">
//                         <a
//                           href={`${baseUrl}/${item.pdfPath?.replace(/\\/g, "/")}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <FiEye className="cursor-pointer hover:text-blue-600" />
//                         </a>
//                         <FiEdit2
//                           className="cursor-pointer hover:text-yellow-600"
//                           onClick={() => {
//                             setEditDocument(item);
//                             setIsUpdateModalOpen(true);
//                           }}
//                         />
//                         <RiDeleteBin6Line
//                           className="cursor-pointer hover:text-red-600"
//                           onClick={() => {
//                             setDeleteId(item.id);
//                             setIsWarnModalOpen(true);
//                           }}
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
//       {isAddNewModalOpen && (
//         <ResultUploadModal
//           setIsAddNewModalOpen={setIsAddNewModalOpen}
//           onSuccess={fetchResults}
//           types={types}
//         />
//       )}
//       {isUpdateModalOpen && (
//         <ResultUpdateModal
//           isUpdateModalOpen={isUpdateModalOpen}
//           editDocument={editDocument}
//           setIsUpdateModalOpen={setIsUpdateModalOpen}
//           onSuccess={fetchResults}
//           types={types}
//         />
//       )}
//       {isWarnModalOpen && (
//         <WarnModal
//           isWarnModalOpen={isWarnModalOpen}
//           setIsWarnModalOpen={setIsWarnModalOpen}
//           onConfirm={handleDelete}
//         />
//       )}
//     </section>
//   );
// };

// export default Result;

import React, { useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ResultUploadModal from '../components/modals/result/ResultUploadModal';
import ResultUpdateModal from '../components/modals/result/ResultUpdateModal';
import WarnModal from '../components/modals/WarnModal';
import axios from "axios";

const Result = () => {
  const baseUrl = "http://localhost:3000";
  const [resultData, setResultData] = useState([]);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editDocument, setEditDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [types, setTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [typesRes, yearsRes] = await Promise.all([
          axios.get(`${baseUrl}/api/masterData/processDocumentTypes`, { withCredentials: true }),
          axios.get(`${baseUrl}/api/masterData/years`, { withCredentials: true })
        ]);
        setTypes(typesRes.data);
        setYears(yearsRes.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/result`, { withCredentials: true });
      setResultData(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error loading results");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${baseUrl}/api/result/${deleteId}`, { withCredentials: true });
      if (res.status === 200) {
        fetchResults();
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Server error during delete");
    } finally {
      setIsWarnModalOpen(false);
      setDeleteId(null);
    }
  };

  const filteredData = resultData.filter(item => {
    const lowerQuery = searchQuery.toLowerCase();
    const typeName = types.find(t => t.id === item.typeId)?.name || "";
    return (
      (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
      (typeName.toLowerCase().includes(lowerQuery)) ||
      (item.year && item.year.toLowerCase().includes(lowerQuery))
    );
  });

  const getStatusStyles = (status) => {
    if (status === "Active") {
      return { text: "text-[#53d28c]", bg: "bg-[#dff7e9]", border: "border-[#53d28c]" };
    } else {
      return { text: "text-[#d26d53]", bg: "bg-[#f7e9df]", border: "border-[#d26d53]" };
    }
  };

  return (
    <section className="bg-white md:p-5 px-3 py-5 rounded-md shadow-md relative">
      {/* Header */}
      <div className="flex justify-between md:mb-5">
        <h1 className="text-xl text-[#002147] font-bold">Result List</h1>
        <div className="space-y-4 text-sm flex items-center gap-4">
          <button
            className="flex items-center gap-1 bg-[#002147] text-white rounded-md px-4 py-2 cursor-pointer"
            onClick={() => setIsAddNewModalOpen(true)}
          >
            <IoMdAdd /> Add New
          </button>
          <div className="hidden md:block">
            Search:{" "}
            <input
              type="text"
              className="border border-gray-300 rounded-md px-4 py-2 ml-2 outline-none text-sm"
              placeholder="Search by Name, Type or Year"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
            placeholder="Search by Name, Type or Year"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full border border-gray-300 rounded-md overflow-hidden text-sm md:text-base">
          <thead>
            <tr className="bg-[#002147] text-white text-center border-b-2 border-[#fab82b]">
              <th className="p-3">S.No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Year</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-red-500">No results found</td>
              </tr>
            ) : (
              filteredData.map((item, index) => {
                const rowBg = index % 2 ? "bg-gray-100" : "bg-white";
                const typeName = types.find(t => t.id === item.typeId)?.name || "Unknown";
                const statusStyles = getStatusStyles(item.status || "");
                return (
                  <tr key={item.id} className={rowBg}>
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{item.title || "-"}</td>
                    <td className="p-3 text-center">{typeName}</td>
                    <td className="p-3 text-center">{item.year || "-"}</td>
                    <td className="p-3 text-center">
                      <span className={`rounded-sm px-2 py-0.5 border border-dashed ${statusStyles.text} ${statusStyles.bg} ${statusStyles.border}`}>
                        {item.status || "-"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-4 text-[#002147] text-lg">
                        <a
                          href={`${baseUrl}/${item.pdfPath?.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiEye className="cursor-pointer hover:text-blue-600" />
                        </a>
                        <FiEdit2
                          className="cursor-pointer hover:text-yellow-600"
                         onClick={() => {
  setEditDocument({
    ...item,
    title: item.title || "", // ensure title is set
  });
  setIsUpdate(true);
}}

                        />
                        <RiDeleteBin6Line
                          className="cursor-pointer hover:text-red-600"
                          onClick={() => {
                            setDeleteId(item.id);
                            setIsWarnModalOpen(true);
                          }}
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
      {isAddNewModalOpen && (
        <ResultUploadModal
          setIsAddNewModalOpen={setIsAddNewModalOpen}
          onSuccess={fetchResults}
          types={types}
          years={years}
        />
      )}

      {isUpdateModalOpen && editDocument && (
        <ResultUpdateModal
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          editDocument={editDocument}
          onSuccess={fetchResults}
          types={types}
          years={years}
        />
      )}

      {isWarnModalOpen && (
        <WarnModal
          isWarnModalOpen={isWarnModalOpen}
          setIsWarnModalOpen={setIsWarnModalOpen}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
};

export default Result;
