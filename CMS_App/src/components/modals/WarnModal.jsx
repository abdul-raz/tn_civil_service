import React, { useEffect, useState } from 'react';
import { PiWarningCircleLight } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";

const WarnModal = ({ setIsWarnModalOpen, isWarnModalOpen, onConfirm }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isWarnModalOpen) setShowModal(true);
  }, [isWarnModalOpen]);

  if (!isWarnModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setIsWarnModalOpen(false)}
      />

      <div
        className={`relative bg-white w-[80%] max-w-md p-6 shadow-xl rounded-md flex flex-col items-center
          transform transition-transform duration-500 ease-out
          ${showModal ? "translate-y-0 opacity-100" : "-translate-y-96 opacity-0"}
        `}
      >
        <PiWarningCircleLight className="md:text-8xl text-6xl text-amber-400" />
        
        <h2 className="md:text-3xl text-2xl font-semibold text-[#002147] md:mb-4 mb-2">
          Are you sure?
        </h2>
        
        <p className="md:text-xl text-md font-light text-center text-[#002147] md:mb-4 mb-2">
          You want to delete this record?
        </p>
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => onConfirm()}
            className="bg-red-500 cursor-pointer md:px-3.5 md:py-1.5 px-3 py-1 text-white text-lg rounded-md hover:bg-red-600 transition"
          >
            Yes, delete it!
          </button>
        </div>

        <button
          onClick={() => setIsWarnModalOpen(false)}
          className="absolute -top-3 -right-3 bg-white shadow-md hover:shadow-none rounded-md p-2 cursor-pointer text-gray-500 text-xl hover:translate-y-3 hover:-translate-x-3 transition-all duration-300"
        >
          <IoCloseSharp />
        </button>
      </div>
    </div>
  );
};

export default WarnModal;
