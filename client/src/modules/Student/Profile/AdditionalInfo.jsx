import { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdditionalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [additionalData, setAdditionalData] = useState({
    backlogsHistory: "No",
    currentBacklogs: "0",
    interestedInPlacement: "Yes",
    skills: "",
    languages: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get student ID from localStorage or context
  const studentID = localStorage.getItem('studentID') || '22071A3255'; // Fallback for testing

  // Fetch additional data on component mount
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:1544/student/additional/${studentID}`);
        
        // Extract only the fields we need
        const { backlogsHistory, currentBacklogs, interestedInPlacement, skills, languages } = response.data;
        setAdditionalData({
          backlogsHistory: backlogsHistory || "No",
          currentBacklogs: currentBacklogs || "0",
          interestedInPlacement: interestedInPlacement || "Yes",
          skills: skills || "",
          languages: languages || ""
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching additional data:', err);
        setError('Failed to load additional information. Please try again later.');
        toast.error('Failed to load additional information');
      } finally {
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, [studentID]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:1544/student/additional/${studentID}`, 
        additionalData
      );
      
      if (response.status === 200) {
        toast.success('Additional information updated successfully');
        
        // Update with the response data
        const { backlogsHistory, currentBacklogs, interestedInPlacement, skills, languages } = response.data;
        setAdditionalData({
          backlogsHistory: backlogsHistory || "No",
          currentBacklogs: currentBacklogs || "0",
          interestedInPlacement: interestedInPlacement || "Yes",
          skills: skills || "",
          languages: languages || ""
        });
      }
    } catch (err) {
      console.error('Error updating additional data:', err);
      toast.error(err.response?.data?.message || 'Failed to update additional information');
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  if (loading && !additionalData.skills) {
    return (
      <div className="mt-4 p-4 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading additional information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4">
        <div className="bg-red-50 p-4 rounded-lg text-red-800">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

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
              ["Backlogs History", additionalData.backlogsHistory],
              ["Current Backlogs", additionalData.currentBacklogs],
              ["Interested in Placement", additionalData.interestedInPlacement],
              ["Skills", additionalData.skills],
              ["Languages Known", additionalData.languages],
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
          ["Backlogs History", additionalData.backlogsHistory],
          ["Current Backlogs", additionalData.currentBacklogs],
          ["Interested in Placement", additionalData.interestedInPlacement],
          ["Skills", additionalData.skills],
          ["Languages Known", additionalData.languages],
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backlogs History <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="backlogsHistory"
                      value="Yes"
                      checked={additionalData.backlogsHistory === 'Yes'}
                      onChange={(e) => setAdditionalData({ ...additionalData, backlogsHistory: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="backlogsHistory"
                      value="No"
                      checked={additionalData.backlogsHistory === 'No'}
                      onChange={(e) => setAdditionalData({ ...additionalData, backlogsHistory: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Backlogs <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={additionalData.currentBacklogs}
                  onChange={(e) => setAdditionalData({ ...additionalData, currentBacklogs: e.target.value })}
                  placeholder="Enter number of backlogs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interested in Placement <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interestedInPlacement"
                      value="Yes"
                      checked={additionalData.interestedInPlacement === 'Yes'}
                      onChange={(e) => setAdditionalData({ ...additionalData, interestedInPlacement: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interestedInPlacement"
                      value="No"
                      checked={additionalData.interestedInPlacement === 'No'}
                      onChange={(e) => setAdditionalData({ ...additionalData, interestedInPlacement: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={additionalData.skills}
                  onChange={(e) => setAdditionalData({ ...additionalData, skills: e.target.value })}
                  placeholder="Enter your skills (comma separated)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Known <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={additionalData.languages}
                  onChange={(e) => setAdditionalData({ ...additionalData, languages: e.target.value })}
                  placeholder="Enter languages you know (comma separated)"
                  rows={3}
                />
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
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Republish'}
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