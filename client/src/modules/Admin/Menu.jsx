import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome, FaGraduationCap, FaUserCircle, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

const Menu = ({ isProfilePage, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Static profile data
  const profileData = {
    name: "Admin User",
    regNumber: "ADMIN001",
    email: "admin@vnrvjiet.in",
    profilePic: null // Set to null to show the default icon
  };

  const menuItems = [
    { text: "Dashboard", icon: <FaHome size={20} />, path: "/Admin/Dashboard" },
    { text: "Campus Projects", icon: <FaGraduationCap size={20} />, path: "/Admin/CampusProjects" },
    { text: "Faculty", icon: <FaChalkboardTeacher size={20} />, path: "/Admin/Faculty" },
    { text: "Students", icon: <FaUserGraduate size={20} />, path: "/Admin/Students" },
  ];

  const handleClick = (item) => {
    navigate(item.path);
    setIsMobileMenuOpen(false);
  };

  // Mobile Menu Overlay
  const MobileMenu = () => (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden
        ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <div 
        className={`fixed top-0 left-0 h-full w-full bg-[#82001A] transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Padding div for top spacing */}
        <div className="bg-[#82001A] pt-20"></div>

        {/* Menu Items */}
        <div className="mt-2">
          {menuItems.map((item) => (
            <div 
              key={item.path} 
              className={`flex flex-col ${
                location.pathname === item.path ? 'bg-[#9b1a31]' : ''
              }`}
              onClick={() => handleClick(item)}
            >
              <div className="flex items-center justify-between py-4 hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out">
                <div className="flex items-center gap-4 pl-6">
                  <span className={`text-white ${
                    location.pathname === item.path ? 'text-yellow-400' : ''
                  }`}>{item.icon}</span>
                  <span className={`font-medium text-lg tracking-wide text-white ${
                    location.pathname === item.path ? 'text-yellow-400' : ''
                  }`}>{item.text}</span>
                </div>
                <FaChevronRight 
                  size={14} 
                  className={`mr-4 ${location.pathname === item.path ? 'text-yellow-400' : 'text-white'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Desktop Menu
  const DesktopMenu = () => (
    <div className={`hidden md:flex flex-col text-white ${
      isProfilePage ? "w-16" : "w-60"
    } bg-[#82001A]`}>
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

  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  );
};

export default Menu;
