import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

import ResultUploadModal from "../components/modals/result/ResultUploadModal";
import ResultUpdateModal from "../components/modals/result/ResultUpdateModal";
import WarnModal from "../components/modals/WarnModal";

const Result = () => {
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);

  const [editDocument, setEditDocument] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [resultData, setResultData] = useState([]);
  const [types, setTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
useEffect(() => {
  const fetchMasterData = async () => {
    try {
      const [typesRes, yearsRes] = await Promise.all([
        axios.get(`${baseUrl}/api/masterData/resultTypes`, { withCredentials: true }),
        axios.get(`${baseUrl}/api/masterData/years`, { withCredentials: true }),
      ]);

      // Ensure states are always arrays
      setTypes(Array.isArray(typesRes.data) ? typesRes.data : []);
      setYears(Array.isArray(yearsRes.data) ? yearsRes.data : []);

    } catch (error) {
      console.error("Failed to fetch master data:", error);
      setTypes([]); // fallback
      setYears([]); // fallback
    }
  };

  fetchMasterData();
}, []);


const fetchResults = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/result`, {
      withCredentials: true,
    });

    // Ensure resultData is always an array
    const data = Array.isArray(res.data) ? res.data : [];
    setResultData(data);

  } catch (error) {
    console.error("Failed to fetch results:", error);
    setResultData([]); // fallback to empty array
  }
};


  useEffect(() => {
    fetchResults();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${baseUrl}/api/result/${deleteId}`, {
        withCredentials: true,
      });
      setIsWarnModalOpen(false);
      setDeleteId(null);
      fetchResults();
    } catch (error) {
      console.error("Failed to delete result:", error);
    }
  };

  const filteredData = resultData.filter((item) => {
    const q = searchQuery.toLowerCase();
    const typeName =
      types.find((t) => t.id === item.typeId)?.name?.toLowerCase() || "";
    return (
      item.title?.toLowerCase().includes(q) ||
      item.year?.toLowerCase().includes(q) ||
      typeName.includes(q)
    );
  });

  const getStatusStyles = (status) => {
    // Accept numeric 0/1 or string "Active"/"Inactive" but style exactly like Notification
    const s =
      typeof status === "number"
        ? status === 1
          ? "active"
          : "inactive"
        : String(status || "").toLowerCase();
    if (s === "active") {
      return {
        text: "text-[#53d28c]",
        bg: "bg-[#dff7e9]",
        border: "border-[#53d28c]",
      };
    }
    return {
      text: "text-[#d26d53]",
      bg: "bg-[#f7e9df]",
      border: "border-[#d26d53]",
    };
  };

  const displayStatus = (status) => {
    if (typeof status === "number") return status === 1 ? "Active" : "Inactive";
    if (status === "1") return "Active";
    if (status === "0") return "Inactive";
    return status || "-";
  };

  return (
    <section className="bg-white md:p-5 px-3 py-5 rounded-md shadow-md relative">
      {/* Header (exactly like Notification) */}
      <div className="flex justify-between md:mb-5">
        <div className="space-y-4">
          <h1 className="text-xl text-[#002147] font-bold">Result List</h1>
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

      {/* Mobile Search (exactly like Notification) */}
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

      {/* Table (exact classes and structure) */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-[#002147] text-white text-center border-b-2 border-[#fabd2d]">
              <th className="p-3">S.No</th>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Year</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-red-500">
                  No results found
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => {
                const rowBg = index % 2 ? "bg-gray-100" : "bg-white";
                const typeName =
                  types.find((t) => t.id === item.typeId)?.name || "Unknown";
                const styles = getStatusStyles(item.status);
                return (
                  <tr key={item.id} className={rowBg}>
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{item.title}</td>
                    <td className="p-3 text-center">{typeName}</td>
                    <td className="p-3 text-center">{item.year}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`rounded-sm px-2 py-0.5 border border-dashed ${styles.text} ${styles.bg} ${styles.border}`}
                      >
                        {displayStatus(item.status)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-4 text-[#002147] text-lg">
                        <div className="relative group">
                          <a
                          href={`http://localhost:3000/${item.pdfPath?.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiEye className="cursor-pointer hover:text-blue-600" />
                        </a>
                         <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform text-gray-800 border-gray-800 border-1 bg-white text-xs px-2 py-1 rounded">
                            View
                          </span>
                        </div>
                       <div className="relative group">
                         <FiEdit2
                          onClick={() => {
                            setEditDocument(item);
                            setIsUpdateModalOpen(true);
                          }}
                          className="cursor-pointer hover:text-yellow-600"
                        />
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform text-gray-800 border-gray-800 border-1 bg-white text-xs px-2 py-1 rounded">
                            Edit
                          </span>
                       </div>
                       <div className="relative group">
                         <RiDeleteBinLine
                          onClick={() => {
                            setDeleteId(item.id);
                            setIsWarnModalOpen(true);
                          }}
                          className="cursor-pointer hover:text-red-600"
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

      {/* Modals (kept in same placement pattern) */}
      {isWarnModalOpen && (
        <WarnModal
          isWarnModalOpen={isWarnModalOpen}
          setIsWarnModalOpen={setIsWarnModalOpen}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {isAddNewModalOpen && (
        <ResultUploadModal
          setIsAddNewModalOpen={setIsAddNewModalOpen}
          types={types}
          years={years}
          onSuccess={fetchResults}
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
    </section>
  );
};

export default Result;
