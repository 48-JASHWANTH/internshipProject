import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; 
import vnrlogo from '../images/vnrvjiet.png'

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 py-5 bg-gray-300 border-b border-gray-300">
        <img
          src={vnrlogo}
          alt="VNRVJIET Logo"
          className="ml-4 h-10"
        />
        <div
          onClick={toggleProfile}
          className="cursor-pointer flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full mr-4"
        >
          <FaUserCircle className="text-gray-700 text-9xl" /> {/* Profile Icon */}
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="absolute top-14 right-4 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="flex items-center px-4 py-2 border-b border-gray-300">
            <FaUserCircle className="text-gray-700 text-3xl mr-3" /> {/* Icon in Profile */}
            <div>
              <p className="font-bold text-sm">XXXXXXXXXX - Name of the Incharge</p>
              <p className="text-xs text-gray-500">user123@example.in</p>
            </div>
          </div>
          <div className="flex flex-col">
            <button className="px-4 py-2 text-left hover:bg-gray-100">Profile</button>
            <button className="px-4 py-2 text-left hover:bg-gray-100">
              Change Password
            </button>
            <button className="px-4 py-2 text-left hover:bg-gray-100">Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;