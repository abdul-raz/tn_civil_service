import { useState } from "react";
import { FaHome, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { BiSolidBookContent } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

const MenuItem = ({ icon, label, onClick, isDropdown, isOpen, path, isActive }) => (
  <Link
    to={path || "#"}
    className={`flex items-center gap-3 p-3 cursor-pointer border-l-2 transition-colors
      ${isActive
        ? "bg-gray-300 border-[#002147] font-semibold" // Active style
        : "hover:bg-gray-300 hover:border-l-2 hover:border-[#002147] border-transparent"
      }
      ${isDropdown ? "justify-between" : ""}
    `}
    onClick={onClick}
  >
    {icon && <span className="text-[#002147] text-xl">{icon}</span>}
    <div className="text-[#002147] font-medium">{label}</div>
    {isDropdown &&
      (isOpen ? (
        <FaChevronUp className="ml-auto" />
      ) : (
        <FaChevronDown className="ml-auto" />
      ))}
  </Link>
);

const SideBar = ({ isSideBarOpen, setIsSideBarOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const location = useLocation();

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems = [
    { label: "Dashboard", icon: <FaHome />, path: "/" },
    {
      label: "CMS Managements",
      icon: <BiSolidBookContent />,
      submenu: [
        { label: "Question Bank", path: "/questionbank" },
        { label: "Gallery", path: "/gallery" },
        { label: "Notification", path: "/notification" },
        { label: "Results", path: "/results" },
      ],
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}

      <aside
        className={`bg-white scrollbar-hide shadow-md h-screen z-30 transition-transform duration-300 ease-in-out w-[80%] md:w-[18%] fixed top-0 left-0 bottom-0 mx-0 overflow-y-auto ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex w-full py-4 items-center justify-center gap-2 mb-4 sticky top-0 bg-white z-10">
          <img src="/TN_logo.png" alt="TN_logo" className="w-12 h-12" />
          <small className="text-[#002147] text-xl font-extrabold">AICSCC</small>
        </div>

        <nav>
          {menuItems.map((item) => {
            const hasSubmenu = !!item.submenu;
            const isOpen = openDropdowns[item.label];

            // ✅ Parent is active if its path matches OR any submenu path matches
            const isParentActive =
              location.pathname === item.path ||
              (hasSubmenu && item.submenu.some((sub) => sub.path === location.pathname));

            return (
              <div key={item.label}>
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isDropdown={hasSubmenu}
                  isOpen={isOpen}
                  isActive={isParentActive}
                  onClick={() =>
                    hasSubmenu ? toggleDropdown(item.label) : setIsSideBarOpen(false)
                  }
                />

                {hasSubmenu && isOpen && (
                  <div className="pl-10">
                    {item.submenu.map((subItem) => (
                      <MenuItem
                        key={subItem.label}
                        label={subItem.label}
                        path={subItem.path}
                        isActive={location.pathname === subItem.path}
                        onClick={() => setIsSideBarOpen(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
