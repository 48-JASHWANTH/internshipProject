import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBell } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";  
import vnrlogo from '../images/vnrvjiet.png';

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate(); 

  const dropdownRef = useRef(null);

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowProfile(false);
  };

  const handleLogout = () => {
    setShowProfile(false); // Close dropdown
    localStorage.removeItem("userToken");  
    navigate("/"); 
  };

  const handleLogo = () => {
    setShowProfile(false); // Close dropdown
    navigate("/Student"); 
  };

  const handleProfile = () => {
    setShowProfile(false); // Close dropdown
    navigate("/Student/Profile");
  };  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
        setShowNotifications(false);
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
        <button onClick={handleLogo}>
          <img src={vnrlogo} alt="VNRVJIET Logo" className="ml-4 h-10" />
        </button>

        <div className="flex items-center">
          {/* Notification Icon */}
          <div
            onClick={toggleNotifications}
            className="cursor-pointer flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full mr-4 relative"
          >
            <FaBell className="text-gray-700 text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">3</span>
          </div>

          {/* Profile Icon */}
          <div
            onClick={toggleProfile}
            className="cursor-pointer flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mr-4"
          >
            <FaUserCircle className="text-gray-700 text-4xl" />
          </div>
        </div>
      </div>

      {/* Dropdowns */}
      <div>
        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-14 right-16 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-2 font-bold border-b">Notifications</div>
            <div className="flex flex-col">
              <p className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">🔔 New Review Assigned</p>
              <p className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">📌 Submission Deadline Tomorrow</p>
              <p className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">✅ Project Approved</p>
            </div>
          </div>
        )}

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute top-14 right-4 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center px-4 py-2 border-b border-gray-300">
              <FaUserCircle className="text-gray-700 text-4xl mr-3" />
              <div>
                <p className="font-bold text-sm">XXXXXXXXXX - Name of the Student</p>
                <p className="text-xs text-gray-500">user123@example.in</p>
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