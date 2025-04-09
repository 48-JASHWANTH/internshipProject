import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";  
import vnrlogo from '../images/vnrvjiet.png';
import { useStore } from "@/store/useStore";

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { profileData, clearProfileData, fetchProfileData, isLoading } = useStore();
  const { user, logout } = useStore();
  console.log(user);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate(); 
  const dropdownRef = useRef(null);

  console.log(profileData);

  // Fetch profile data when component mounts
  useEffect(() => {
    if (user?.facultyID && fetchProfileData) {
      fetchProfileData(user.facultyID);
    }
  }, [user, fetchProfileData]);

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const handleLogout = async () => {
    setShowProfile(false);
    
    try {
      // Call the logout function from auth slice
      if (logout) {
        await logout();
      }
      
      // Clear profile data
      clearProfileData();
      
      // Remove token from localStorage
      localStorage.removeItem("userToken");
      
      // Navigate to login page
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogo = () => {
    setShowProfile(false); // Close dropdown
    navigate("/Faculty/Dashboard"); 
  };

  const handleProfile = () => {
    setShowProfile(false); // Close dropdown
    navigate("/Faculty/FacultyProfile");
  };  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
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
          {/* Profile Icon */}
          <div
            onClick={toggleProfile}
            className="cursor-pointer flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full overflow-hidden"
          >
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 w-full h-full"></div>
            ) : profileData && profileData.profilePic ? (
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
        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute top-14 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center px-4 py-2 border-b border-gray-300">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-3">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 w-full h-full"></div>
                ) : profileData && profileData.profilePic ? (
                  <img 
                    src={profileData.profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-gray-700 w-full h-full" />
                )}
              </div>
              <div>
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="animate-pulse bg-gray-300 h-4 w-32 rounded"></div>
                    <div className="animate-pulse bg-gray-300 h-3 w-24 rounded"></div>
                    <div className="animate-pulse bg-gray-300 h-3 w-28 rounded"></div>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-sm">
                      {profileData ? 
                        `${profileData.empcode || user?.facultyID || ''} - ${profileData.empname || user?.name || ''}` : 
                        'Loading...'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profileData?.email || user?.email || ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profileData?.department || ''}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <button onClick={handleProfile} className="px-4 py-2 text-left hover:bg-gray-100">
                Profile
              </button>
              <button onClick={handleLogout} className="px-4 py-2 text-left hover:bg-gray-100 text-red-600">
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