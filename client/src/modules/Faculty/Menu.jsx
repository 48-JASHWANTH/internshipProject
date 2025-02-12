import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {FaChevronRight, FaHome, FaArchive, FaProjectDiagram, FaPlus } from "react-icons/fa";

const Menu = ({ isProfilePage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <FaHome size={20} />, path: "/Faculty/Dashboard" },
    { text: "Projects", icon: <FaProjectDiagram size={20} />, path: "/Faculty/Projects" },
    { text: "Archived", icon: <FaArchive size={20} />, path: "/Faculty/Archived" },
  ];

  const handleClick = (item) => { 
    navigate(item.path);
  };

  return (
    <div className={`flex flex-col bg-[#82001A] text-white ${
      isProfilePage ? "w-16" : "w-60"
    } h-[calc(100vh-4rem)] fixed left-0`}>
      <div className="flex flex-col pt-4">
        {menuItems.map((item) => (
          <div 
            key={item.path} 
            className={`flex flex-col border-b border-[#9b1a31] ${
              location.pathname === item.path ? 'bg-[#9b1a31]' : ''
            }`}
            onClick={() => handleClick(item)}
          >
            <div className="flex items-center justify-between py-4 hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out">
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
      <div className="flex-1"></div>
      <div 
        onClick={() => navigate("/Faculty/Create")}
        className={`flex items-center gap-3 justify-center bg-yellow-400 text-black py-3 hover:bg-yellow-500 transition-all duration-200 ease-in-out cursor-pointer ${
          isProfilePage ? "mx-2" : "mx-4"
        } mb-4 rounded-lg`}
      >
        <FaPlus size={14} />
        {!isProfilePage && <span className="font-medium text-sm">Create Project</span>}
      </div>
    </div>
  );
};

export default Menu;  