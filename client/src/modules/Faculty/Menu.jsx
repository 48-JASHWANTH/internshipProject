import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome, FaArchive, FaForumbee, FaBriefcase, FaGraduationCap, FaUserCircle, FaPlus, FaBell } from "react-icons/fa";
import useFacultyProfileStore from '../../store/useFacultyProfileStore';

const Menu = ({ isProfilePage, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileData } = useFacultyProfileStore();
  const [expandedItem, setExpandedItem] = React.useState(null);

  const menuItems = [
    { text: "Dashboard", icon: <FaHome size={20} />, path: "/Faculty/Dashboard" },
    { 
      text: "Active Works", 
      icon: <FaBriefcase size={20} />, 
      path: "/Faculty/ActiveWorks",
      subItems: [
        { text: "Incharge", path: "/Faculty/ActiveWorks/Incharge" },
        { text: "Guide", path: "/Faculty/ActiveWorks/Guide" }
      ]
    },
    { text: "Archived", icon: <FaArchive size={20} />, path: "/Faculty/ArchivedProjects" },
    { text: "Campus Projects", icon: <FaGraduationCap size={20} />, path: "/Faculty/CampusProjects" },
    { text: "Project Forum", icon: <FaForumbee size={20} />, path: "/Faculty/ProjectForum" },
  ];

  const notificationsItem = { 
    text: "Notifications", 
    icon: <FaBell size={20} />, 
    path: "/Faculty/Notifications" 
  };

  const handleClick = (item) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.text ? null : item.text);
    } else {
      setExpandedItem(null);
      navigate(item.path);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSubItemClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleCreateClick = () => {
    navigate("/Faculty/Create");
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
        {/* Simplified User Info Section */}
        <div className="bg-[#82001A] p-4 pt-20">
          <div className="flex items-center space-x-3 mb-4 border-b border-[#9b1a31] pb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
              {profileData.profilePic ? (
                <img 
                  src={profileData.profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-400" />
              )}
            </div>
            <div className="text-white">
              <p className="text-sm font-medium">Welcome,</p>
              <p className="text-xs opacity-90 py-1">{profileData.name}</p>
              <p className="text-xs opacity-75">Student ID: {profileData.regNumber}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-2 flex-grow overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.path} className="flex flex-col">
              <div 
                className={`flex items-center justify-between py-4 hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out ${
                  location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'bg-[#9b1a31]' : ''
                }`}
                onClick={() => handleClick(item)}
              >
                <div className="flex items-center gap-4 pl-6">
                  <span className={`text-white ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'text-yellow-400' : ''
                  }`}>{item.icon}</span>
                  <span className={`font-medium text-lg tracking-wide text-white ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'text-yellow-400' : ''
                  }`}>{item.text}</span>
                </div>
                {item.subItems ? (
                  <FaChevronRight 
                    size={14} 
                    className={`mr-4 transform transition-transform duration-200 ${
                      expandedItem === item.text ? 'rotate-90' : ''
                    } ${
                      location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'text-yellow-400' : 'text-white'
                    }`}
                  />
                ) : (
                  <FaChevronRight 
                    size={14} 
                    className={`mr-4 ${location.pathname === item.path ? 'text-yellow-400' : 'text-white'}`}
                  />
                )}
              </div>
              
              {/* Submenu Items */}
              {item.subItems && (
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#9b1a31]/50 ${
                    expandedItem === item.text ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  {item.subItems.map((subItem) => (
                    <div 
                      key={subItem.path}
                      className={`flex items-center py-3 pl-16 cursor-pointer hover:bg-[#9b1a31] ${
                        location.pathname === subItem.path ? 'bg-[#9b1a31]' : ''
                      }`}
                      onClick={() => handleSubItemClick(subItem.path)}
                    >
                      <span className={`text-sm font-medium ${
                        location.pathname === subItem.path ? 'text-yellow-400' : 'text-white'
                      }`}>
                        {subItem.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add notifications before create button */}
        <div className="mt-auto border-t border-[#9b1a31]">
          <div 
            className={`flex items-center justify-between py-4 hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out ${
              location.pathname === notificationsItem.path ? 'bg-[#9b1a31]' : ''
            }`}
            onClick={() => handleClick(notificationsItem)}
          >
            <div className="flex items-center gap-4 pl-6">
              <span className={`text-white ${
                location.pathname === notificationsItem.path ? 'text-yellow-400' : ''
              }`}>{notificationsItem.icon}</span>
              <span className={`font-medium text-lg tracking-wide text-white ${
                location.pathname === notificationsItem.path ? 'text-yellow-400' : ''
              }`}>{notificationsItem.text}</span>
            </div>
            <FaChevronRight 
              size={14} 
              className={`mr-4 ${location.pathname === notificationsItem.path ? 'text-yellow-400' : 'text-white'}`}
            />
          </div>
          
          {/* Existing create button */}
          <div className="px-4 py-5 border-t border-[#9b1a31]">
            <button
              onClick={handleCreateClick}
              className="flex items-center justify-center w-full gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#82001A] font-medium py-3 px-4 rounded-md transition-colors duration-200"
              aria-label="Create new project"
            >
              <FaPlus size={16} />
              <span>Create </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Menu
  const DesktopMenu = () => (
    <div className={`hidden md:flex flex-col text-white h-full overflow-hidden
      ${isProfilePage ? "w-16" : "w-60"} 
      bg-[#82001A] transition-[width] duration-300 ease-in-out will-change-auto`}>
      <div className="flex flex-col pt-4 flex-grow overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.path} className="flex flex-col border-b border-[#9b1a31]">
            <div 
              className={`flex items-center justify-between py-[16px] hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out ${
                location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'bg-[#9b1a31]' : ''
              }`}
              onClick={() => handleClick(item)}
            >
              <div className="flex items-center gap-4 pl-6">
                <span className={`text-white ${
                  location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'text-yellow-400' : ''
                }`}>{item.icon}</span>
                {!isProfilePage && (
                  <span className={`font-medium text-sm tracking-wide ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'text-yellow-400' : ''
                  }`}>{item.text}</span>
                )}
              </div>
              {!isProfilePage && item.subItems ? (
                <FaChevronRight 
                  size={14} 
                  className={`mr-4 transform transition-transform duration-200 ${
                    expandedItem === item.text ? 'rotate-90' : ''
                  } ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'text-yellow-400' : 'text-yellow-400'
                  }`}
                />
              ) : !isProfilePage && (
                <FaChevronRight 
                  size={14} 
                  className={`mr-4 ${location.pathname === item.path ? 'text-yellow-400' : 'text-yellow-400'}`}
                />
              )}
            </div>
            
            {/* Submenu Items */}
            {!isProfilePage && item.subItems && (
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#9b1a31]/50 ${
                  expandedItem === item.text ? 'max-h-40' : 'max-h-0'
                }`}
              >
                {item.subItems.map((subItem) => (
                  <div 
                    key={subItem.path}
                    className={`flex items-center py-3 pl-16 cursor-pointer hover:bg-[#9b1a31] ${
                      location.pathname === subItem.path ? 'bg-[#9b1a31]' : ''
                    }`}
                    onClick={() => handleSubItemClick(subItem.path)}
                  >
                    <span className={`text-sm font-medium ${
                      location.pathname === subItem.path ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {subItem.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Add notifications before create button */}
      <div className="mt-auto border-t border-[#9b1a31]">
        <div 
          className={`flex items-center justify-between py-[16px] hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out ${
            location.pathname === notificationsItem.path ? 'bg-[#9b1a31]' : ''
          }`}
          onClick={() => handleClick(notificationsItem)}
        >
          <div className="flex items-center gap-4 pl-6">
            <span className={`text-white ${
              location.pathname === notificationsItem.path ? 'text-yellow-400' : ''
            }`}>{notificationsItem.icon}</span>
            {!isProfilePage && (
              <span className={`font-medium text-sm tracking-wide ${
                location.pathname === notificationsItem.path ? 'text-yellow-400' : ''
              }`}>{notificationsItem.text}</span>
            )}
          </div>
          {!isProfilePage && (
            <FaChevronRight 
              size={14} 
              className={`mr-4 ${location.pathname === notificationsItem.path ? 'text-yellow-400' : 'text-yellow-400'}`}
            />
          )}
        </div>
        
        {/* Existing create button */}
        <div className={`px-4 py-5 border-t border-[#9b1a31] ${isProfilePage ? "flex justify-center" : ""}`}>
          <button
            onClick={handleCreateClick}
            className={`flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#82001A] font-medium py-2 rounded-md transition-colors duration-200 ${
              isProfilePage ? "w-10 h-10 p-0" : "w-full px-4"
            }`}
            aria-label="Create new project"
            tabIndex="0"
          >
            <FaPlus size={16} />
            {!isProfilePage && <span className="transition-opacity duration-300 ease-in-out">Create Project</span>}
          </button>
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

export default Menu;
