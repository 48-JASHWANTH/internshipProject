import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {FaChevronRight, FaHome, FaTasks, FaArchive, FaProjectDiagram, FaForumbee, FaBriefcase, FaGraduationCap } from "react-icons/fa";

const Sidemenu = ({ isProfilePage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <FaHome size={20} />, path: "/Student/Dashboard" },
    { text: "Active Works", icon: <FaBriefcase size={20} />, path: "/Student/ActiveWorks" },
    { text: "Archived", icon: <FaArchive size={20} />, path: "/Student/ArchivedProjects" },
    { text: "Campus Projects", icon: <FaGraduationCap size={20} />, path: "/Student/CampusProjects" },
    { text: "Project Forum", icon: <FaForumbee size={20} />, path: "/Student/ProjectForum" },
  ];  

  const handleClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className={`flex flex-col text-white ${
      isProfilePage ? "w-16" : "w-60"
    } h-screen fixed left-0`}>
      <div className="flex flex-col pt-4">
        {menuItems.map((item) => (
          <div 
            key={item.path} 
            className={`flex flex-col border-b border-[#9b1a31] ${
              location.pathname === item.path ? 'bg-[#9b1a31]' : ''
            }`}
            onClick={() => handleClick(item)}
          >
            <div className="flex items-center justify-between py-[16px] hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out">
              <div className="flex items-center gap-4 pl-6">
                <span className={`text-white ${
                  location.pathname === item.path ? 'text-yellow-400' : ''  
                }`}>{item.icon}</span>
                {!isProfilePage && (
                  <span className={`font-medium text-sm tracking-wide ${
                    location.pathname === item.path ? 'text-yellow-400' : ''
                  }`}>{item.text}</span>
                )}
              </div>
              {!isProfilePage && (
                <FaChevronRight 
                  size={14} 
                  className={`mr-4 ${location.pathname === item.path ? 'text-yellow-400' : 'text-yellow-400'}`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidemenu;
