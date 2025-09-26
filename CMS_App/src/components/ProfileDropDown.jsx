import React from "react";
import { FaUser } from "react-icons/fa";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";

const ProfileDropDown = ({ setProfileDropDown, setIsPasswordResetOpen, setLog }) => {
  const size = 10;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // send session cookie
      });

      const data = await response.json();

      if (response.ok) {
        setLog(false); // update frontend login state
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      alert("Network error during logout");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-opacity-50 z-10"
        onClick={() => setProfileDropDown(false)}
      />
      <div className="absolute -bottom-42 md:right-5 right-2 bg-white rounded-xl shadow-md z-15">
        <ul onClick={() => setProfileDropDown(false)}>
          <li
            className="flex border-b-1 items-center border-gray-200 p-3 gap-3 md:px-10 px-5 hover:bg-gray-300 cursor-pointer rounded-t-xl"
            onClick={(e) => e.stopPropagation()} // stop parent onClick
          >
            <div className={`relative inline-block w-${size} h-${size} cursor-pointer`}>
              <FaUser
                className={`w-${size} h-${size} text-[#5e89c1] rounded-full object-cover outline-1 p-1`}
              />
              <span
                className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                title="Online"
              />
            </div>
            <div>
              <p className="text-md">Test</p>
              <p className="text-gray-400 text-sm">Super-Admin</p>
            </div>
          </li>

          <li
            onClick={(e) => {
              e.stopPropagation(); // prevent closing dropdown
              setIsPasswordResetOpen(true);
            }}
            className="text-gray-500 flex items-center border-b-1 border-gray-200 p-3 gap-3 md:px-10 px-5 hover:bg-gray-300 cursor-pointer"
          >
            <IoSettingsOutline className="text-xl" />
            Reset Password
          </li>

          <li
            onClick={(e) => {
              e.stopPropagation(); // prevent closing dropdown
              handleLogout();
            }}
            className="text-gray-500 flex items-center border-b-1 border-gray-200 p-3 gap-3 md:px-10 px-5 hover:bg-gray-300 cursor-pointer rounded-b-xl"
          >
            <IoLogOutOutline className="text-xl" />
            Log Out
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProfileDropDown;
