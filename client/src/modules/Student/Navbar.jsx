import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import vnrlogo from "../images/vnrvjiet.png";
import { useStore } from '@/store/useStore';

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  
  const studentData = useStore(state => state.studentData);
  const {user,fetchStudentData} = useStore()
  const logout = useStore(state => state.logout);
  const dropdownRef = useRef(null);

  useEffect(()=>{
    if(user?.studentID && fetchStudentData){
      fetchStudentData(user.studentID)
    }
  },[user,fetchStudentData])
  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate("/");
  };

  const handleLogo = () => {
    setShowProfile(false);
    navigate("/Student/Dashboard");
  };

  const handleProfile = () => {
    setShowProfile(false);
    navigate("/Student/Profile");
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
            {studentData?.personal?.profilePic ? (
              <img 
                src={studentData.personal.profilePic} 
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

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="absolute top-14 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="flex items-center px-4 py-2 border-b border-gray-300">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-3">
              {studentData?.personal?.profilePic ? (
                <img 
                  src={studentData.personal.profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-700 text-4xl" />
              )}
            </div>
            <div>
              <p className="font-bold text-sm">{`${studentData?.academic?.studentID || ''} - ${studentData?.personal?.name || ''}`}</p>
              <p className="text-xs text-gray-500">{studentData?.personal?.mail || ''}</p>
              <p className="text-xs text-gray-500">{studentData?.academic?.department || ''}</p>
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
  );
};

export default Navbar;