import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaFolderOpen, FaClipboardList, FaChevronRight } from "react-icons/fa";

const Sidemenu = ({ isProfilePage }) => {
  const menuItems = [
    { text: "Dashboard", icon: <FaTachometerAlt />, path: "/Student/Dashboard" },
    { text: "Active Works", icon: <FaFolderOpen />, path: "/Student/ActiveWorks" },
    { text: "Archived Projects", icon: <FaClipboardList />, path: "/Student/ArchivedProjects" },
    { text: "Campus Projects", icon: <FaFolderOpen />, path: "/Student/CampusProjects" },
  ];

  return (
    <div
      className={`flex flex-col bg-[#82001A] text-white transition-all duration-300 ${
        isProfilePage ? "w-16" : "w-64"
      } min-h-screen p-4`}
    >
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className="flex items-center justify-between py-5 rounded-lg hover:bg-[#a00020] cursor-pointer transition-all duration-300"
        >
          <span className="text-xl">{item.icon}</span>
          {!isProfilePage && <span className="font-semibold flex-1 text-center">{item.text}</span>}
          {!isProfilePage && <FaChevronRight className="text-yellow-400 text-sm" />}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidemenu;
