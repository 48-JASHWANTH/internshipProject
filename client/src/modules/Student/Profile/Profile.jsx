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
  const [profileData, setProfileData] = useState({
    name: "Sriram Chowdary",
    regNumber: "22071A3254",
    email: "tadapanenisriram333@gmail.com",
    phone: "+91 7674843849",
    gender: "Male",
    dob: "2004-09-01",
  });

  const handleChangePassword = () => {
    navigate("/StudentChangePassword");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-red-900 to-yellow-400 flex items-center justify-center relative rounded-md">
        <h1 className="text-white text-2xl font-bold">Student Profile</h1>
      </div>

      <div className="flex p-6">
        {/* Profile Card */}
        <ProfileCard profileData={profileData} setProfileData={setProfileData} />

        {/* Main Content */}
        <div className="w-3/4 ml-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex space-x-4 border-b pb-2">
              <button
                className={`pb-2 ${activeTab === "academic" ? "text-[#82001A] border-b-2 border-[#82001A]" : "text-gray-500"}`}
                onClick={() => setActiveTab("academic")}
              >
                Academic Information
              </button>
              <button
                className={`pb-2 ${activeTab === "additional" ? "text-[#82001A] border-b-2 border-[#82001A]" : "text-gray-500"}`}
                onClick={() => setActiveTab("additional")}
              >
                Additional Information
              </button>
              <button
                className={`pb-2 ${activeTab === "resume" ? "text-[#82001A] border-b-2 border-[#82001A]" : "text-gray-500"}`}
                onClick={() => setActiveTab("resume")}
              >
                Resume
              </button>
              <button
                className={`pb-2 ${activeTab === "settings" ? "text-[#82001A] border-b-2 border-[#82001A]" : "text-gray-500"}`}
                onClick={() => setActiveTab("settings")}
              >
                Account & Settings
              </button>
            </div>

            {activeTab === "academic" && <AcademicInfo />}
            {activeTab === "additional" && <AdditionalInfo />}
            {activeTab === "resume" && <Resume />}
            {activeTab === "settings" && <Account handleChangePassword={handleChangePassword} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
