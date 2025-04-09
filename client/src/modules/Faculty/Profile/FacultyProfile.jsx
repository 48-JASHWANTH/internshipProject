import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import BasicInfo from "./BasicInfo";
import AdditionalInfo from "./AdditionalInfo";
import Account from "./Account";

const FacultyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");

  // Optional: Load initial data if needed
  useEffect(() => {
    // If you need to fetch initial data from an API
    const fetchInitialData = async () => {
      try {
        // const response = await fetch('/api/faculty/profile');
        // const data = await response.json();
        // setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    // fetchInitialData();
  }, []);

  const handleChangePassword = () => {
    navigate("/reset-password");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="w-full h-32 md:h-40 bg-gradient-to-r from-red-900 to-yellow-400 flex items-center justify-center relative rounded-md">
        <h1 className="text-white text-xl md:text-2xl font-bold">Faculty Profile</h1>
      </div>

      <div className="flex flex-col lg:flex-row p-4 md:p-6 gap-6">
        {/* Profile Card - Full width on mobile, 1/4 on desktop */}
        <div className="w-full lg:w-1/4">
          <ProfileCard />
        </div>

        {/* Main Content - Full width on mobile, 3/4 on desktop */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            {/* Scrollable tabs container for mobile */}
            <div className="overflow-x-auto">
              <div className="flex space-x-4 border-b pb-2 min-w-max">
                {['basic', 'additional', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-2 whitespace-nowrap ${
                      activeTab === tab 
                        ? "text-[#82001A] border-b-2 border-[#82001A]" 
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {activeTab === "basic" && <BasicInfo />}
              {activeTab === "additional" && <AdditionalInfo />}
              {activeTab === "settings" && <Account handleChangePassword={handleChangePassword} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
