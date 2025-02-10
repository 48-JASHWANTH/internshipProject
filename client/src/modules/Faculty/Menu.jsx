import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaFolderOpen, FaClipboardList, FaChevronRight, FaPlus } from "react-icons/fa";

const Menu = ({ isProfilePage }) => {
  const menuItems = [
    { text: "Dashboard", icon: <FaTachometerAlt />, path: "/Faculty/FacultyDashboard" },
    { text: "Active Works", icon: <FaFolderOpen />, path: "/Faculty/FacultyActiveWorks" },
    { text: "Archived Projects", icon: <FaClipboardList />, path: "/Faculty/FacultyArchivedProjects" },
  ];

  return (
    <div
      className={`flex flex-col bg-[#82001A] text-white transition-all duration-300 ${
        isProfilePage ? "w-16" : "w-64"
      } min-h-screen p-4`}
    >
      <div className="flex-1">
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
      <NavLink 
        to="/Faculty/CreateProject"
        className="flex items-center justify-center bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 gap-2"
      >
        <FaPlus />
        {!isProfilePage && "Create Project"}
      </NavLink>
    </div>
  );
};

export default Menu;