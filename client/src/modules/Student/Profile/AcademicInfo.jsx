import React, { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useStore} from '@/store/useStore';
import { apiClient } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';

const AcademicInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [academicData, setAcademicData] = useState({
    campus: '',
    batch: '',
    department: '',
    degree: '',
    tenth: '',
    twelfth: '',
    diploma: 'NA',
    underGraduate: '',
    postGraduate: 'NA'
  });
  
  const { user, studentData, loading, error, fetchStudentData, setLoading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }

    if (!studentData) {
      console.log("from academic");
      fetchStudentData(user.studentID);
    }
  }, [fetchStudentData, user, navigate]);

  useEffect(() => {
    if (studentData) {
      setAcademicData(studentData.academic);
    }
  }, [studentData]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await apiClient.put(
        `/academic/${user.studentID}`, 
        academicData,{withCredentials:true}
      );
      
      if (response.status === 200) {
        toast.success('Academic information updated successfully');
        setAcademicData(response.data);
      }
    } catch (err) {
      console.error('Error updating academic data:', err);
      toast.error(err.response?.data?.message || 'Failed to update academic information');
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  if (loading && !academicData.campus) {
    return (
      <div className="mt-4 p-4 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading academic information...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="mt-4 p-2 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Academic Information</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">View and manage your academic details</p>
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
              ["Campus", academicData.campus],
              ["Batch", academicData.batch],
              ["Department", academicData.department],
              ["Degree", academicData.degree],
              ["10th", academicData.tenth ? academicData.tenth + "%" : ""],
              ["12th", academicData.twelfth ? academicData.twelfth + "%" : ""],
              ["Diploma", academicData.diploma],
              ["Under Graduate", academicData.underGraduate ? academicData.underGraduate + " CGPA" : ""],
              ["Post Graduate", academicData.postGraduate],
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
          ["Campus", academicData.campus],
          ["Batch", academicData.batch],
          ["Department", academicData.department],
          ["Degree", academicData.degree],
          ["10th", academicData.tenth ? academicData.tenth + "%" : ""],
          ["12th", academicData.twelfth ? academicData.twelfth + "%" : ""],
          ["Diploma", academicData.diploma],
          ["Under Graduate", academicData.underGraduate ? academicData.underGraduate + " CGPA" : ""],
          ["Post Graduate", academicData.postGraduate],
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
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Academic Information</h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Update your academic details here</p>
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
              {/* Read-only Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  { label: "Campus", value: academicData.campus },
                  { label: "Batch", value: academicData.batch },
                  { label: "Department", value: academicData.department },
                  { label: "Degree", value: academicData.degree },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed text-sm"
                      value={value}
                      readOnly
                    />
                  </div>
                ))}
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* 10th and 12th */}
                {[
                  { label: "10th", value: "tenth" },
                  { label: "12th", value: "twelfth" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      {label} {label === "10th" && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex gap-2">
                      <select className="w-1/3 border border-gray-300 rounded-lg px-2 py-2 text-sm">
                        <option>%</option>
                        <option>GPA</option>
                      </select>
                      <input
                        type="text"
                        className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={academicData[value]}
                        onChange={(e) => setAcademicData({ ...academicData, [value]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}

                {/* Under Graduate and Post Graduate */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Under Graduate</label>
                  <div className="flex gap-2">
                    <select className="w-1/3 border border-gray-300 rounded-lg px-2 py-2 text-sm">
                      <option>CGPA</option>
                      <option>%</option>
                    </select>
                    <input
                      type="text"
                      className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={academicData.underGraduate}
                      onChange={(e) => setAcademicData({ ...academicData, underGraduate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Post Graduate</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={academicData.postGraduate}
                    onChange={(e) => setAcademicData({ ...academicData, postGraduate: e.target.value })}
                  >
                    <option value="NA">NA</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Diploma */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Diploma</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={academicData.diploma}
                  onChange={(e) => setAcademicData({ ...academicData, diploma: e.target.value })}
                >
                  <option value="NA">NA</option>
                  <option value="Completed">Completed</option>
                </select>
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

export default AcademicInfo;
