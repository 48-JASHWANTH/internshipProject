import { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
// import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

const BasicInfo = () => {
  const { profileData, updateProfileData, isLoading, error, fetchProfileData } = useStore();
  const { user } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    workLocation: '',
    department: '',
    designation: '',
    manager1: '',
    manager2: '',
    employmentType: '',
    teachType: '',
    shift: '',
    status: ''
  });

  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) {
      setEmployeeData({
        workLocation: profileData.workLocation || '',
        department: profileData.department || '',
        designation: profileData.designation || '',
        manager1: profileData.manager1 || '',
        manager2: profileData.manager2 || '',
        employmentType: profileData.employmentType || '',
        teachType: profileData.teachType || '',
        shift: profileData.shift || '',
        status: profileData.status || ''
      });
    }
  }, [profileData]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Get faculty ID from user state or profile data
      const facultyId = user?.facultyID || profileData?.empcode;
      
      if (!facultyId) {
        toast.error('Faculty ID not found');
        setIsSaving(false);
        return;
      }
      
      // Make API call to update faculty data
      const response = await apiClient.put(
        `faculty/update/${facultyId}`,
        employeeData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update local state
        updateProfileData(employeeData);
        
        // Refresh profile data from server
        if (fetchProfileData) {
          fetchProfileData(facultyId);
        }
        
        toast.success('Employee information updated successfully');
        setIsEditing(false);
      } else {
        toast.error(response.data.message || 'Failed to update employee information');
      }
    } catch (error) {
      console.error('Error updating employee information:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating employee information');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-2 md:p-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#82001A]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-2 md:p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>Error loading profile data: {error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="mt-4 p-2 md:p-4">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          <p>No profile data available. Please try again later.</p>
        </div>
      </div>
    );
  }

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
              ["Work Location", profileData.workLocation || "Not specified"],
              ["Department", profileData.department || "Not specified"],
              ["Designation", profileData.designation || "Not specified"],
              ["Manager 1", profileData.manager1 || "Not specified"],
              ["Manager 2", profileData.manager2 || "Not specified"],
              ["Employment Type", profileData.employmentType || "Not specified"],
              ["Teach Type", profileData.teachType || "Not specified"],
              ["Shift", profileData.shift || "Not specified"],
              ["Status", profileData.status || "Not specified"],
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
          ["Work Location", profileData.workLocation || "Not specified"],
          ["Department", profileData.department || "Not specified"],
          ["Designation", profileData.designation || "Not specified"],
          ["Manager 1", profileData.manager1 || "Not specified"],
          ["Manager 2", profileData.manager2 || "Not specified"],
          ["Employment Type", profileData.employmentType || "Not specified"],
          ["Teach Type", profileData.teachType || "Not specified"],
          ["Shift", profileData.shift || "Not specified"],
          ["Status", profileData.status || "Not specified"],
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
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-xs md:text-sm font-medium text-white bg-[#82001A] rounded-lg hover:bg-[#6b0016] disabled:opacity-50 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
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
