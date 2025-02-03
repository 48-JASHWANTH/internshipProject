import React from "react";
import { FaUserCircle, FaGithub, FaLinkedin, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    console.log("Edit Profile Clicked");
  };

  const handleChangePassword = () => {
    navigate("/StudentChangePassword");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-gray-500 text-6xl" />
          <h2 className="mt-2 text-xl font-semibold">John Doe</h2>
          <span className="text-sm text-gray-600">Published</span>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <p><strong>Student ID:</strong> 22071A3254</p>
          <p><strong>Email:</strong> johndoe@example.com</p>
          <p><strong>Department:</strong> CSBS</p>
          <p><strong>Year:</strong> 2026</p>
          <p><strong>Contact:</strong> +91-9876543210</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 ml-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Academic & Project Details</h2>
          <table className="w-full mt-4 border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Information</th>
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-4 py-2">Current Semester</td><td className="px-4 py-2">6th</td></tr>
              <tr><td className="px-4 py-2">Active Projects</td><td className="px-4 py-2">2</td></tr>
              <tr><td className="px-4 py-2">Completed Projects</td><td className="px-4 py-2">5</td></tr>
              <tr><td className="px-4 py-2">Total Reviews Received</td><td className="px-4 py-2">12</td></tr>
              <tr><td className="px-4 py-2">Performance Rating</td><td className="px-4 py-2">4.5/5</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-semibold">Project Contributions & Achievements</h2>
          <p><strong>Project Roles:</strong> Team Leader, Reviewer</p>
          <p><strong>Skills:</strong> React.js, Node.js, Python</p>
          <p><strong>Certifications:</strong> AWS Cloud Practitioner</p>
          <p><strong>Badges:</strong> Top Performer, Bug Bounty Winner</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-semibold">Account & Settings</h2>
          <div className="flex items-center mt-4">
            <FaLock className="text-gray-500 text-xl mr-2" />
            <button onClick={handleChangePassword} className="text-blue-500 underline">Change Password</button>
          </div>
          <div className="flex items-center mt-4">
            <FaGithub className="text-gray-500 text-xl mr-2" />
            <a href="https://github.com/johndoe" className="text-blue-500 underline">GitHub</a>
          </div>
          <div className="flex items-center mt-4">
            <FaLinkedin className="text-gray-500 text-xl mr-2" />
            <a href="https://linkedin.com/in/johndoe" className="text-blue-500 underline">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
