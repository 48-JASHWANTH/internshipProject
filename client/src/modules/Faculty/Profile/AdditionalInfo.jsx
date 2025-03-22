import { useState } from 'react';
import { Edit, X } from 'lucide-react';
import {useStore} from '@/store/useStore';

const AdditionalInfo = () => {
  const { profileData, updateProfileData } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [additionalData, setAdditionalData] = useState({
    joiningDate: profileData.joiningDate || "",
    qualification: profileData.qualification || "",
    natureOfAssociation: profileData.natureOfAssociation || "Regular",
    alternateEmail: profileData.alternateEmail || "",
    emergencyContact: profileData.emergencyContact || ""
  });

  const handleSaveChanges = (e) => {
    e.preventDefault();
    updateProfileData(additionalData);
    setIsEditing(false);
  };

  return (
    <div className="mt-4 p-2 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Additional Information</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">View and manage your additional details</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center px-3 py-2 text-sm text-[#82001A] hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit 
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-red-900 to-yellow-400">
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-white">Information</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-white">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              ["Joining Date", profileData.joiningDate],
              ["Qualification", profileData.qualification],
              ["Nature of Association", profileData.natureOfAssociation],
              ["Alternate Email", profileData.alternateEmail],
              ["Emergency Contact", profileData.emergencyContact],
            ].map(([info, detail], index) => (
              <tr key={info} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm font-medium text-gray-900">{info}</td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-gray-500">{detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {[
          ["Joining Date", profileData.joiningDate],
          ["Qualification", profileData.qualification],
          ["Nature of Association", profileData.natureOfAssociation],
          ["Alternate Email", profileData.alternateEmail],
          ["Emergency Contact", profileData.emergencyContact],
        ].map(([info, detail]) => (
          <div key={info} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-900 mb-1">{info}</div>
            <div className="text-sm text-gray-500">{detail}</div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Additional Information</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Update your additional details here</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveChanges} className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Joining Date - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joining Date
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed text-sm"
                  value={additionalData.joiningDate}
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Set by administrator and cannot be edited</p>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={additionalData.qualification}
                  onChange={(e) => setAdditionalData({ ...additionalData, qualification: e.target.value })}
                  placeholder="Enter your highest qualification"
                />
              </div>

              {/* Nature of Association */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nature of Association <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={additionalData.natureOfAssociation}
                  onChange={(e) => setAdditionalData({ ...additionalData, natureOfAssociation: e.target.value })}
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Visiting">Visiting</option>
                  <option value="Adjunct">Adjunct</option>
                </select>
              </div>

              {/* Alternate Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={additionalData.alternateEmail}
                  onChange={(e) => setAdditionalData({ ...additionalData, alternateEmail: e.target.value })}
                  placeholder="Enter your personal email address"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select className="w-20 border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>+91</option>
                  </select>
                  <input
                    type="tel"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={additionalData.emergencyContact.replace('+91 ', '')}
                    onChange={(e) => setAdditionalData({ ...additionalData, emergencyContact: '+91 ' + e.target.value })}
                    placeholder="Enter emergency contact number"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-3 py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-xs md:text-sm font-medium text-white bg-[#82001A] rounded-lg hover:bg-[#6b0016]"
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

export default AdditionalInfo;