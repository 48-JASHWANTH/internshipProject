import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';

// Add this constant for review names based on project type
const REVIEW_NAMES = {
  CBP: [
    '0th Review',
    'Abstract',
    'Literature',
    'Design',
    'Final '
  ],
  Mini: [
    '0th Review',
    'Abstract',
    'Literature',
    'Design',
    'Final '
  ],
  FP: [
    '0th Review',
    'Abstract',
    'Literature',
    'Design',
    'Final'
  ],
  Major: [
    '0th Review',
    'Abstract',
    'Literature',
    'Design',
    'Implementation',
    'Project Expo',
    'External (Final)'
  ]
};

const AddReviewModal = ({ onClose, onAddReview, teamMembers = [], projectId }) => {
  const { activeProjects } = useStore();
  
  // Find the project type from the store data
  const projectType = useMemo(() => {
    if (!activeProjects?.teams || !activeProjects?.sectionTeams) return 'CBP';
    
    // Find the team
    const team = activeProjects.teams.find(t => t.teamId === projectId);
    if (!team) return 'CBP';
    
    // Find the section team to get the project type
    const sectionId = team.teamId.split('_')[0];
    const sectionTeam = activeProjects.sectionTeams.find(s => s.classID === sectionId);
    
    return sectionTeam?.projectType || 'CBP';
  }, [activeProjects, projectId]);
  
  const [formData, setFormData] = useState({
    reviewName: '',
    dateOfReview: new Date().toISOString().split('T')[0],
    satisfactionLevel: '',
    remarks: '',
    feedback: '',
    progress: '',
    changesToBeMade: '',
    presentees: []
  });
  const [isCustomReview, setIsCustomReview] = useState(false);
  const [errors, setErrors] = useState({});

  // Get the appropriate review names and add "Other" option
  const reviewOptions = [...(REVIEW_NAMES[projectType] || REVIEW_NAMES.CBP), 'Other'];

  const handleReviewNameChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setIsCustomReview(true);
      setFormData({ ...formData, reviewName: '' });
    } else {
      setIsCustomReview(false);
      setFormData({ ...formData, reviewName: value });
    }
    setErrors({ ...errors, reviewName: '' });
  };

  const handleSubmit = () => {
    // Validate required fields
    const newErrors = {};
    if (!formData.reviewName.trim()) newErrors.reviewName = 'Review name is required';
    if (!formData.satisfactionLevel) newErrors.satisfactionLevel = 'Satisfaction level is required';
    if (!formData.remarks.trim()) newErrors.remarks = 'Remarks are required';
    if (!formData.feedback.trim()) newErrors.feedback = 'Feedback is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create a list of student names for presentees
    const presenteeNames = formData.presentees.map(studentId => {
      const student = teamMembers.find(s => s.id === studentId);
      return student ? student.name : studentId;
    });

    // Call the onAddReview function with the form data and presentee names
    onAddReview({
      ...formData,
      presentees: presenteeNames
    });
  };

  const handlePresenteeChange = (studentId) => {
    setFormData(prev => {
      const presentees = [...prev.presentees];
      
      if (presentees.includes(studentId)) {
        // Remove student if already selected
        return {
          ...prev,
          presentees: presentees.filter(id => id !== studentId)
        };
      } else {
        // Add student if not already selected
        return {
          ...prev,
          presentees: [...presentees, studentId]
        };
      }
    });
  };

  const renderField = (name, label, type = 'text', options = null, className = '') => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      {type === 'select' ? (
        <select
          value={formData[name]}
          onChange={(e) => {
            setFormData({ ...formData, [name]: e.target.value });
            setErrors({ ...errors, [name]: '' });
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none ${
            errors[name] ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={formData[name]}
          onChange={(e) => {
            setFormData({ ...formData, [name]: e.target.value });
            setErrors({ ...errors, [name]: '' });
          }}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none ${
            errors[name] ? 'border-red-500' : ''
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={type}
          value={formData[name]}
          onChange={(e) => {
            setFormData({ ...formData, [name]: e.target.value });
            setErrors({ ...errors, [name]: '' });
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none ${
            errors[name] ? 'border-red-500' : ''
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-semibold">Add New Review</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!isCustomReview ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Name <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.reviewName}
                onChange={handleReviewNameChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none ${
                  errors.reviewName ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select Review Name</option>
                {reviewOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.reviewName && (
                <p className="mt-1 text-sm text-red-500">{errors.reviewName}</p>
              )}
            </div>
          ) : (
            renderField('reviewName', 'Review Name')
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {renderField('dateOfReview', 'Date of Review', 'date', null, 'col-span-1')}
            {renderField('satisfactionLevel', 'Satisfaction Level', 'select', [
              'Poor',
              'Fair',
              'Good',
              'Very Good',
              'Excellent'
            ], 'col-span-1')}
          </div>
          
          {renderField('progress', 'Progress')}
          {renderField('remarks', 'Remarks')}
          {renderField('feedback', 'Detailed Feedback', 'textarea')}
          {renderField('changesToBeMade', 'Changes To Be Made', 'textarea')}
          
          {/* Presentees Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Presentees
            </label>
            <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
              {teamMembers.length === 0 ? (
                <p className="text-sm text-gray-500">No team members available</p>
              ) : (
                <div className="space-y-2">
                  {teamMembers.map(student => (
                    <div key={student.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`student-${student.id}`}
                        checked={formData.presentees.includes(student.id)}
                        onChange={() => handlePresenteeChange(student.id)}
                        className="w-4 h-4 text-[#9b1a31] focus:ring-[#9b1a31] border-gray-300 rounded"
                      />
                      <label htmlFor={`student-${student.id}`} className="ml-2 text-sm text-gray-700">
                        {student.name} ({student.id})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors"
          >
            Add Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal; 