import { useState } from "react"
import { Edit } from 'lucide-react';
import {
  FaUserCircle,
  FaGithub,
  FaLinkedin,
  FaLock,
  FaDownload, 
  FaUpload,
  FaFileAlt,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("academic")

  const handleEditProfile = () => {
    console.log("Edit Profile Clicked")
  }

  const handleChangePassword = () => {
    navigate("/StudentChangePassword")
  }

  const EditIcon = () => (
    <span className="text-blue-600 inline-flex items-center gap-1 text-sm">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 12.5H12.5" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.0835 2.37435C7.31506 2.14279 7.63157 2.01318 7.96127 2.01318C8.12581 2.01318 8.28836 2.04577 8.43913 2.10938C8.58989 2.17299 8.72587 2.26642 8.83904 2.37959C8.95221 2.49276 9.04564 2.62874 9.10925 2.7795C9.17286 2.93027 9.20545 3.09282 9.20545 3.25736C9.20545 3.42189 9.17286 3.58445 9.10925 3.73521C9.04564 3.88598 8.95221 4.02196 8.83904 4.13513L4.5 8.47417L2.5 9.00001L3.02583 7.00001L7.0835 2.37435Z" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Edit
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="w-full h-40 bg-gradient-to-r from-red-900  to-yellow-200 flex items-center justify-center relative rounded-md">
        <h1 className="text-white text-2xl font-bold">Student Profile</h1>
      </div>

      <div className="flex p-6">
        {/* Profile Card */}
        <div className="w-1/4 bg-white rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-2">
                <img 
                  src="/api/placeholder/96/96"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold">Sriram Chowdary</h2>
              <span className="text-orange-400 text-sm">Published</span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold">Personal Information</h3>
                <button onClick={handleEditProfile}>
                <span className="flex items-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="text-sm">Sriram Chowdary</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Registration Number</div>
                  <div className="text-sm">22071A3254</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-sm">tadapanenisriram333@gmail.com</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="text-sm">+91 - 7674843849</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Gender</div>
                  <div className="text-sm">Male</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Date of Birth</div>
                  <div className="text-sm">01-09-04</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Tag</div>
                  <div className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm">
                    neopat
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4 ml-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex space-x-4 border-b pb-2">
              <button
                className={`pb-2 ${activeTab === "academic" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("academic")}
              >
                Academic Information
              </button>
              <button
                className={`pb-2 ${activeTab === "additional" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("additional")}
              >
                Additional Information
              </button>
              <button
                className={`pb-2 ${activeTab === "resume" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("resume")}
              >
                Resume
              </button>
              <button
                className={`pb-2 ${activeTab === "settings" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("settings")}
              >
                Account & Settings
              </button>
            </div>

            {/* Academic Information */}
            {activeTab === "academic" && (
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Academic Information</h2>
                  <button onClick={handleEditProfile}>
                  <span className="flex items-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </span>
                  </button>
                </div>
                <table className="w-full mt-4 border border-gray-300">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="px-4 py-2 text-left">Information</th>
                      <th className="px-4 py-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">10th</td>
                      <td className="px-4 py-2">89.4%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">12th</td>
                      <td className="px-4 py-2">96.9%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Under Graduate</td>
                      <td className="px-4 py-2">9.28 CGPA</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Diploma</td>
                      <td className="px-4 py-2">Not Applicable</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Post Graduate</td>
                      <td className="px-4 py-2">Not Applicable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Additional Information */}
            {activeTab === "additional" && (
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Additional Information</h2>
                  <button onClick={handleEditProfile}>
                  <span className="flex items-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </span>
                  </button>
                </div>
                <table className="w-full mt-4 border border-gray-300">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="px-4 py-2 text-left">Information</th>
                      <th className="px-4 py-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">Backlogs History</td>
                      <td className="px-4 py-2">No</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Current Backlogs</td>
                      <td className="px-4 py-2">0</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Interested in Placement</td>
                      <td className="px-4 py-2">Yes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Skills</td>
                      <td className="px-4 py-2">Node.js, React</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Languages Known</td>
                      <td className="px-4 py-2">English, Hindi, Telugu</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Resume */}
            {activeTab === "resume" && (
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Resume Management</h2>
                  <div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
                      <FaUpload className="inline mr-1" /> Upload New
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                      <FaDownload className="inline mr-1" /> Download
                    </button>
                  </div>
                </div>
                <div className="mt-4 border-2 border-dashed border-gray-300 p-8 text-center">
                  <FaFileAlt className="text-gray-400 text-5xl mx-auto mb-2" />
                  <p className="text-lg font-semibold">resume.pdf</p>
                  <p className="text-sm text-gray-500">Last updated: Jan 30, 2024</p>
                </div>
              </div>
            )}

            {/* Account & Settings */}
            {activeTab === "settings" && (
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Account & Settings</h2>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <FaLock className="text-gray-500 text-xl mr-2" />
                    <button onClick={handleChangePassword} className="text-blue-600">
                      Change Password
                    </button>
                  </div>
                  <div className="flex items-center">
                    <FaGithub className="text-gray-500 text-xl mr-2" />
                    <a
                      href="https://github.com/sriramchowdary"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      GitHub
                    </a>
                  </div>
                  <div className="flex items-center">
                    <FaLinkedin className="text-gray-500 text-xl mr-2" />
                    <a
                      href="https://linkedin.com/in/sriramchowdary"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile