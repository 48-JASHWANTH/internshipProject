import { useState } from 'react';
import { Edit, X } from 'lucide-react';

const AcademicInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [academicData, setAcademicData] = useState({
    campus: "VNR VJIET",
    batch: "2022-2026",
    department: "CSBS",
    degree: "B.Tech",
    tenth: "89.4",
    twelfth: "96.9",
    diploma: "NA",
    underGraduate: "9.28",
    postGraduate: "NA"
  });

  const handleSaveChanges = (e) => {
    e.preventDefault();
    console.log("Updated Academic Information:", academicData);
    setIsEditing(false);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Academic Information</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage your academic details</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center px-4 py-2 text-[#82001A] hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit 
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-red-900 to-yellow-400">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Information</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              ["Campus", academicData.campus],
              ["Batch", academicData.batch],
              ["Department", academicData.department],
              ["Degree", academicData.degree],
              ["10th", academicData.tenth + "%"],
              ["12th", academicData.twelfth + "%"],
              ["Diploma", academicData.diploma],
              ["Under Graduate", academicData.underGraduate + " CGPA"],
              ["Post Graduate", academicData.postGraduate],
            ].map(([info, detail], index) => (
              <tr key={info} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{info}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Academic Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your academic details here</p>
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                    value={academicData.campus}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                    value={academicData.batch}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                    value={academicData.department}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                    value={academicData.degree}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    10th <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                      <option>%</option>
                      <option>GPA</option>
                    </select>
                    <input
                      type="text"
                      className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      value={academicData.tenth}
                      onChange={(e) => setAcademicData({ ...academicData, tenth: e.target.value })}
                      placeholder="Enter value"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">12th</label>
                  <div className="flex gap-2">
                    <select className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                      <option>%</option>
                      <option>GPA</option>
                    </select>
                    <input
                      type="text"
                      className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      value={academicData.twelfth}
                      onChange={(e) => setAcademicData({ ...academicData, twelfth: e.target.value })}
                      placeholder="Enter value"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diploma</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  value={academicData.diploma}
                  onChange={(e) => setAcademicData({ ...academicData, diploma: e.target.value })}
                >
                  <option value="NA">NA</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Under Graduate</label>
                  <div className="flex gap-2">
                    <select className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                      <option>CGPA</option>
                      <option>%</option>
                      <option>GPA</option>
                    </select>
                    <input
                      type="text"
                      className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      value={academicData.underGraduate}
                      onChange={(e) => setAcademicData({ ...academicData, underGraduate: e.target.value })}
                      placeholder="Enter value"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Graduate</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    value={academicData.postGraduate}
                    onChange={(e) => setAcademicData({ ...academicData, postGraduate: e.target.value })}
                  >
                    <option value="NA">NA</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#82001A] rounded-lg hover:bg-[#6b0016] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Republish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicInfo;
