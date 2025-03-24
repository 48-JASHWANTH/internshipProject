import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddReviewModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    reviewName: '',
    dueDate: '',
    satisfactionLevel: '',
    remarks: '',
    feedback: '',
    status: 'reviewed'
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    // Validate all fields
    const newErrors = {};
    if (!formData.reviewName.trim()) newErrors.reviewName = 'Review name is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.satisfactionLevel) newErrors.satisfactionLevel = 'Satisfaction level is required';
    if (!formData.remarks.trim()) newErrors.remarks = 'Remarks are required';
    if (!formData.feedback.trim()) newErrors.feedback = 'Feedback is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('New Review Data:', {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'Guide' // Added type identifier
    });
    onClose();
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
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Add New Review</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {renderField('reviewName', 'Review Name')}
          
          <div className="grid grid-cols-2 gap-4">
            {renderField('dueDate', 'Due Date', 'date', null, 'col-span-1')}
            {renderField('satisfactionLevel', 'Satisfaction Level', 'select', [
              'Poor',
              'Fair',
              'Good',
              'Very Good',
              'Excellent'
            ], 'col-span-1')}
          </div>

          {renderField('remarks', 'Remarks')}
          {renderField('feedback', 'Detailed Feedback', 'textarea')}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
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