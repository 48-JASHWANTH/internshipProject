import React, { useState } from 'react';
import { X } from 'lucide-react';

const DOMAINS = ["AI/ML", "Web", "Mobile", "IoT"];

const AddProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    techStack: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.domain) newErrors.domain = 'Domain is required';
    if (!formData.techStack.trim()) newErrors.techStack = 'Tech stack is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Log project details in required format
    console.log({
      id: Date.now().toString(),
      Guide: "Dr. John Doe", // This would come from auth context in a real app
      Title: formData.title,
      Domain: formData.domain,
      Description: formData.description,
      TechStack: formData.techStack.split(',').map(tech => tech.trim()),
      Status: "Open"
    });

    // Reset form and close modal
    setFormData({ title: '', domain: '', description: '', techStack: '' });
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
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#82001A] focus:border-[#82001A] outline-none ${
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
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#82001A] focus:border-[#82001A] outline-none ${
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
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#82001A] focus:border-[#82001A] outline-none ${
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Add New Project</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {renderField('title', 'Project Title')}
            {renderField('domain', 'Domain', 'select', DOMAINS)}
            {renderField('techStack', 'Tech Stack', 'text')}
            {renderField('description', 'Description', 'textarea')}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015] transition-colors"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal; 