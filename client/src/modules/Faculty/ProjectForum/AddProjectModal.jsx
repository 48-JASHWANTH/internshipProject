import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

const DOMAINS = ["AI/ML", "Web", "Mobile", "IoT", "Blockchain", "Cloud Computing", "Cybersecurity", "Data Science", "Artificial Intelligence"];

const AddProjectModal = ({ isOpen, onClose, onProjectAdded }) => {
  const { user } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    techStack: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
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

    if (!user?.facultyID) {
      toast.error('Faculty ID not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format project data according to API requirements
      const projectData = {
        Title: formData.title,
        Domain: formData.domain,
        TechStack: formData.techStack.split(',').map(tech => tech.trim()),
        Description: formData.description,
        facultyId: user.facultyID
      };

      console.log('Creating new forum project:', projectData);

      // Make API request to create project
      const response = await apiClient.post(
        '/forum-projects/create-forum-projects',
        projectData,
        { withCredentials: true }
      );

      if (response.data.success) {
        const newProject = response.data.project;
        
        // Send notification to all students
        try {
          console.log('Sending forum project creation notification');
          
          // Format tech stack for notification
          const techStackFormatted = formData.techStack
            .split(',')
            .map(tech => tech.trim())
            .join(', ');
          
          // Create the notification payload
          const notificationPayload = {
            title: 'New Project Opportunity Available',
            body: `📋 PROJECT DETAILS
───────────────────
• Title: ${formData.title}
• Domain: ${formData.domain}
• Tech Stack: ${techStackFormatted}

📝 DESCRIPTION
───────────────────
${formData.description}

👤 POSTED BY
───────────────────
${user.name || 'Faculty'} (${user.department || 'Department'})

⚠️ Check Project Forum for more details and to join this project.`,
            type: 'forum',
            recipientModel: 'Student',
            // We don't specify recipients - the server will fetch all students
          };
          
          console.log('Notification payload:', notificationPayload);
          
          // Send notification to all students via API
          const notificationResponse = await apiClient.post(
            '/api/notifications/forum-project',
            {
              projectTitle: formData.title,
              projectId: newProject._id,
              domain: formData.domain,
              techStack: techStackFormatted,
              description: formData.description,
              faculty: {
                name: user.name || 'Faculty',
                department: user.department || 'Department',
                facultyID: user.facultyID
              }
            },
            { withCredentials: true }
          );
          
          console.log('Notification response:', notificationResponse.data);
        } catch (notificationError) {
          console.error('Error sending project notification:', notificationError);
          // Continue with the flow even if notification fails
        }

        toast.success('Project created successfully!');
        // Reset form and close modal
        setFormData({ title: '', domain: '', description: '', techStack: '' });
        
        // Call the callback function if provided to refresh the projects list
        if (onProjectAdded) {
          onProjectAdded(response.data.project);
        }
        
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'An error occurred while creating the project');
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {renderField('title', 'Project Title')}
            {renderField('domain', 'Domain', 'select', DOMAINS)}
            {renderField('techStack', 'Tech Stack', 'text')}
            <p className="text-xs text-gray-500 -mt-3">Separate technologies with commas (e.g., React, Node.js, MongoDB)</p>
            {renderField('description', 'Description', 'textarea')}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0015] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal; 