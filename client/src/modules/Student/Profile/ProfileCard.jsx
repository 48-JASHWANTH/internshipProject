import { useState } from 'react';
import { Edit, X } from 'lucide-react';

const ProfileCard = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...profileData });

  const handleSaveChanges = (e) => {
    e.preventDefault();
    console.group('Profile Information Update');
    console.log('Name:', editedData.name);
    console.log('Registration Number:', editedData.regNumber);
    console.log('Email:', editedData.email);
    console.log('Phone:', editedData.phone);
    console.log('Gender:', editedData.gender);
    console.log('Date of Birth:', editedData.dob);
    console.groupEnd();
    setProfileData(editedData);
    setIsEditing(false);
  };

  return (
    <div className="w-1/4 bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-3">
            <img 
              src={profileData.profilePic || "../../assets/profilepic.png"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{profileData.name}</h3>
          <span className="text-orange-400 text-sm">Published</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Registration Number</label>
            <div className="text-sm font-medium text-gray-800">{profileData.regNumber}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <div className="text-sm font-medium text-gray-800">{profileData.email}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Phone</label>
            <div className="text-sm font-medium text-gray-800">{profileData.phone}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Gender</label>
            <div className="text-sm font-medium text-gray-800">{profileData.gender}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Date of Birth</label>
            <div className="text-sm font-medium text-gray-800">{profileData.dob}</div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your photo and personal details here</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveChanges} className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={editedData.profilePic || "../../assets/profilepic.png"} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  Upload
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editedData.name.split(' ')[0]}
                    onChange={(e) => {
                      const lastName = editedData.name.split(' ').slice(1).join(' ');
                      setEditedData({ ...editedData, name: `${e.target.value} ${lastName}` });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editedData.name.split(' ').slice(1).join(' ')}
                    onChange={(e) => {
                      const firstName = editedData.name.split(' ')[0];
                      setEditedData({ ...editedData, name: `${firstName} ${e.target.value}` });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  {['Male', 'Female', 'Others'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={editedData.gender === option}
                        onChange={(e) => setEditedData({ ...editedData, gender: e.target.value })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone No <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select className="w-20 border border-gray-300 rounded-lg px-2 py-2">
                    <option>🇮🇳 +91</option>
                  </select>
                  <input
                    type="tel"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editedData.phone.replace('+91 ', '')}
                    onChange={(e) => setEditedData({ ...editedData, phone: '+91 ' + e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editedData.dob}
                    onChange={(e) => setEditedData({ ...editedData, dob: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editedData.regNumber}
                    onChange={(e) => setEditedData({ ...editedData, regNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#82001A] rounded-lg hover:bg-[#6b0016] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#82001A]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
