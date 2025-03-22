import { useState } from 'react';
import { Edit, X } from 'lucide-react';
import {useStore} from '@/store/useStore';

const BasicInfo = () => {
  const { profileData, updateProfileData } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    workLocation: profileData.workLocation || "Main Campus",
    department: profileData.department || "Computer Science",
    designation: profileData.designation || "Assistant Professor",
    manager1: profileData.manager1 || "",
    manager2: profileData.manager2 || "",
    employmentType: profileData.employmentType || "Full-Time",
    teachType: profileData.teachType || "Regular",
    shift: profileData.shift || "General Shift",
    status: profileData.status || "Active"
  });

  const handleSaveChanges = (e) => {
    e.preventDefault();
    updateProfileData(employeeData);
    setIsEditing(false);
  };

  return (
    <div className="mt-4 p-2 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Employee Information</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">View your employee details</p>
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
              ["Work Location", profileData.workLocation || employeeData.workLocation],
              ["Department", profileData.department || employeeData.department],
              ["Designation", profileData.designation || employeeData.designation],
              ["Manager 1", profileData.manager1 || employeeData.manager1],
              ["Manager 2", profileData.manager2 || employeeData.manager2],
              ["Employment Type", profileData.employmentType || employeeData.employmentType],
              ["Teach Type", profileData.teachType || employeeData.teachType],
              ["Shift", profileData.shift || employeeData.shift],
              ["Status", profileData.status || employeeData.status],
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
          ["Work Location", profileData.workLocation || employeeData.workLocation],
          ["Department", profileData.department || employeeData.department],
          ["Designation", profileData.designation || employeeData.designation],
          ["Manager 1", profileData.manager1 || employeeData.manager1],
          ["Manager 2", profileData.manager2 || employeeData.manager2],
          ["Employment Type", profileData.employmentType || employeeData.employmentType],
          ["Teach Type", profileData.teachType || employeeData.teachType],
          ["Shift", profileData.shift || employeeData.shift],
          ["Status", profileData.status || employeeData.status],
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
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Employee Information</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">View your employee details</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  { label: "Work Location", key: "workLocation" },
                  { label: "Department", key: "department" },
                  { label: "Designation", key: "designation" },
                  { label: "Manager 1", key: "manager1" },
                  { label: "Manager 2", key: "manager2" },
                  { label: "Employment Type", key: "employmentType" },
                  { label: "Teach Type", key: "teachType" },
                  { label: "Shift", key: "shift" },
                  { label: "Status", key: "status" },
                ].map(({ label, key }) => (
                  <div key={label}>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={employeeData[key] || ''}
                      onChange={(e) => setEmployeeData({ ...employeeData, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
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

export default BasicInfo;
