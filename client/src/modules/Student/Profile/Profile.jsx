import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import AcademicInfo from "./AcademicInfo";
import AdditionalInfo from "./AdditionalInfo";
import Resume from "./Resume";
import Account from "./Account";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("academic");

  const handleChangePassword = () => {
    navigate("/StudentChangePassword");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="w-full h-32 md:h-40 bg-gradient-to-r from-red-900 to-yellow-400 flex items-center justify-center relative rounded-md">
        <h1 className="text-white text-xl md:text-2xl font-bold">Student Profile</h1>
      </div>

      <div className="flex flex-col lg:flex-row p-4 md:p-6 gap-6">
        {/* Profile Card - Full width on mobile, 1/4 on desktop */}
        <div className="w-full lg:w-1/4">
          <ProfileCard  />
        </div>

        {/* Main Content - Full width on mobile, 3/4 on desktop */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            {/* Scrollable tabs container for mobile */}
            <div className="overflow-x-auto">
              <div className="flex space-x-4 border-b pb-2 min-w-max">
                {['academic', 'additional', 'resume', 'settings'].map((tab) => (
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
              {activeTab === "academic" && <AcademicInfo />}
              {activeTab === "additional" && <AdditionalInfo />}
              {activeTab === "resume" && <Resume />}
              {activeTab === "settings" && <Account handleChangePassword={handleChangePassword} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
