import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import vnrlogo from "../images/vnrvjiet.png";

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // Static profile data
  const profileData = {
    name: "Admin User",
    regNumber: "ADMIN001",
    email: "admin@vnrvjiet.in",
    profilePic: null // Set to null to show the default icon
  };

  const [showProfile, setShowProfile] = useState(false);
  // const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate(); 

  const dropdownRef = useRef(null);

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    // setShowNotifications(false);
  };

  // const toggleNotifications = () => {
  //   setShowNotifications((prev) => !prev);
  //   setShowProfile(false);
  // };

  const handleLogout = () => {
    setShowProfile(false);
    // Remove token from localStorage
    localStorage.removeItem("userToken");
    navigate("/");
  };

  const handleLogo = () => {
    setShowProfile(false); // Close dropdown
    navigate("/Admin/Dashboard");
  };

  const handleProfile = () => {
    setShowProfile(false); // Close dropdown
    navigate("/Admin/Profile");
  };  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
        // setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="fixed top-0 left-0 w-full z-50 bg-gray-300 border-b border-gray-300">
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 py-3">
        <button onClick={handleLogo} className="flex items-center">
          <img src={vnrlogo} alt="VNRVJIET Logo" className="h-10" />
        </button>

        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          {/* <div
            // onClick={toggleNotifications}
            className="cursor-pointer flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full relative"
          >
            <FaBell className="text-gray-700 text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">3</span>
          </div> */}

          {/* Profile Icon */}
          <div
            onClick={toggleProfile}
            className="cursor-pointer flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full overflow-hidden"
          >
            {profileData.profilePic ? (
              <img 
                src={profileData.profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-gray-700 text-4xl" />
            )}
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-[#82001A]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Dropdowns */}
      <div>
        {/* Notifications Dropdown */}
        {/* {showNotifications && (
          <div className="absolute top-14 right-16 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-2 font-bold border-b">Notifications</div>
            <div className="flex flex-col">
              <p className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">🔔 New Review Assigned</p>
              <p className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">📌 Submission Deadline Tomorrow</p>
              <p className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">✅ Project Approved</p>
            </div>
          </div>
        )} */}

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute top-14 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center px-4 py-2 border-b border-gray-300">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-3">
                {profileData.profilePic ? (
                  <img 
                    src={profileData.profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-gray-700 text-4xl" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm">{`${profileData.regNumber} - ${profileData.name}`}</p>
                <p className="text-xs text-gray-500">{profileData.email}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <button onClick={handleProfile} className="px-4 py-2 text-left hover:bg-gray-100">
                Profile
              </button>
              <button onClick={handleLogout} className="px-4 py-2 text-left hover:bg-gray-100">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;