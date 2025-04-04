import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome, FaArchive, FaForumbee, FaBriefcase, FaGraduationCap, FaUserCircle, FaBell } from "react-icons/fa";

const Sidemenu = ({ isProfilePage, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <FaHome size={20} />, path: "/Student/Dashboard" },
    { text: "Active Works", icon: <FaBriefcase size={20} />, path: "/Student/ActiveWorks" },
    { text: "Archived", icon: <FaArchive size={20} />, path: "/Student/ArchivedProjects" },
    { text: "Campus Projects", icon: <FaGraduationCap size={20} />, path: "/Student/CampusProjects" },
    { text: "Project Forum", icon: <FaForumbee size={20} />, path: "/Student/ProjectForum" },
  ];

  const notificationsItem = { 
    text: "Notifications", 
    icon: <FaBell size={20} />, 
    path: "/Student/Notifications" 
  };

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
        className={`fixed top-0 left-0 h-full w-full bg-[#82001A] transform transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simple Header */}
        <div className="bg-[#82001A] p-4 pt-12 pb-6 border-b border-[#9b1a31]">
          <h2 className="text-xl font-bold text-white text-center"></h2>
        </div>

        {/* Menu Items */}
        <div className="flex-grow overflow-y-auto">
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

        {/* Add notifications before bottom */}
        <div className="mt-auto border-t border-[#9b1a31]">
          <div 
            className="flex items-center justify-between py-4 px-4 pb-6 bg-[#82001A] hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() => handleClick(notificationsItem)}
            tabIndex="0"
            role="button"
            aria-label="Navigate to Notifications"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClick(notificationsItem);
              }
            }}
          >
            <div className="flex items-center gap-4 pl-6">
              <span className="text-white">{notificationsItem.icon}</span>
              <span className="font-medium text-lg tracking-wide text-white">{notificationsItem.text}</span>
            </div>
            <FaChevronRight 
              size={14} 
              className="mr-4 text-yellow-400"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Menu
  const DesktopMenu = () => (
    <div className={`hidden md:flex flex-col text-white ${
      isProfilePage ? "w-16" : "w-60"
    } bg-[#82001A]`}>
      <div className="flex flex-col pt-4 flex-grow">
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
                  className={`mr-4 ${location.pathname === item.path ? 'text-yellow-400' : 'text-white'}`}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add notifications before bottom */}
      <div className="mt-auto border-t border-[#9b1a31]">
        <div 
          className="flex items-center justify-between p-4 bg-[#82001A] hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out"
          onClick={() => handleClick(notificationsItem)}
          tabIndex="0"
          role="button"
          aria-label="Navigate to Notifications"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(notificationsItem);
            }
          }}
        >
          <div className="flex items-center gap-4 pl-6">
            <span className="text-white">{notificationsItem.icon}</span>
            {!isProfilePage && (
              <span className="font-medium text-sm tracking-wide text-white">{notificationsItem.text}</span>
            )}
          </div>
          {!isProfilePage && (
            <FaChevronRight 
              size={14} 
              className="mr-4 text-yellow-400"
            />
          )}
        </div>
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

export default Sidemenu;
