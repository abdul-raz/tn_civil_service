import React, { useState } from "react";
import { FaUser, FaBars } from "react-icons/fa";
import ProfileDropDown from "./ProfileDropDown";
import { useLocation } from "react-router-dom";
import PasswordResetModal from "./modals/PasswordResetModal";

const Header = ({setIsSideBarOpen, isSideBarOpen ,setLog}) => {
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const location = useLocation();

  // Extract last part of path for title
  const path = location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

  let headerTitle = path;
  if (headerTitle === "notification"|| headerTitle === "results" || headerTitle === "questionbank" || headerTitle === "gallery" || headerTitle === "answerkey" || headerTitle === "withexplanation") {
    headerTitle = "CMS Managements";
  }else if (headerTitle === "dashboard") {
    headerTitle = "Dashboard";
  }

  return (
    <header className="relative bg-white md:px-5 px-3 py-3  rounded-md shadow-md flex justify-between items-center">
      <button onClick={()=>{setIsSideBarOpen(!isSideBarOpen)}} className="lg:hidden text-[#002147] text-2xl">
        <FaBars />
      </button>

      <h1 className="text-xl font-bold text-[#002147]">{headerTitle}</h1>

      <div
        className="relative inline-block w-10 h-10 cursor-pointer"
        onClick={() => setProfileDropDown(!profileDropDown)}
      >
        <FaUser className="w-10 h-10 text-[#5e89c1] rounded-full object-cover p-1 border" />

        <span
          className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"
          title="Online"
        />
      </div>

      {profileDropDown && <ProfileDropDown setLog={setLog} setProfileDropDown={setProfileDropDown} setIsPasswordResetOpen={setIsPasswordResetOpen}/>}
{isPasswordResetOpen && <PasswordResetModal isPasswordResetOpen={isPasswordResetOpen} setIsPasswordResetOpen={setIsPasswordResetOpen}/>}
    </header>
  );
};

export default Header;
