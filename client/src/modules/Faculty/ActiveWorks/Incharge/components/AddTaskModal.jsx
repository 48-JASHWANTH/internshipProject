import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

const AddTaskModal = ({ onClose, onAddTask, teamMembers = [] }) => {
  const { user } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium'
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (selectedStudents.length === 0) newErrors.students = 'Select at least one student';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create a comma-separated string of student names
      const assignedToString = selectedStudents
        .map(studentId => {
          // Find the student object by ID
          const student = teamMembers.find(s => s.id === studentId);
          return student ? student.name : studentId;
        })
        .join(', ');
      
      // Prepare task data according to the API structure in zfaculty.http
      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        assignedTo: assignedToString,
        assignedBy: {
          name: user?.name || 'Faculty',
          type: 'Incharge',
          facultyID: user?.facultyID
        }
      };

      // Call the onAddTask function with the task data
      // This will be handled by the parent component (InchargeWorkboard)
      if (onAddTask) {
        await onAddTask(taskData);
        setShowSuccess(true);
      } else {
        toast.error('Error: Task submission handler not provided');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
    // Clear error when selection changes
    setErrors(prev => ({ ...prev, students: '' }));
  };

  const renderField = (name, label, type = 'text', options = null) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      {type === 'select' ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none ${
            errors[name] ? 'border-red-500' : ''
          }`}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none min-h-[100px] ${
            errors[name] ? 'border-red-500' : ''
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none ${
            errors[name] ? 'border-red-500' : ''
          }`}
          placeholder={type === 'date' ? '' : `Enter ${label.toLowerCase()}`}
          min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 text-center">
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Task Assigned Successfully!</h3>
          <p className="text-gray-600 mb-6">
            The task has been assigned to {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''}.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl relative">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Assign New Task</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {renderField('title', 'Task Title')}
          {renderField('description', 'Description', 'textarea')}

          <div className="grid grid-cols-2 gap-4">
            {renderField('dueDate', 'Due Date', 'date')}
            {renderField('priority', 'Priority', 'select', ['Low', 'Medium', 'High'])}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Assign to Students <span className="text-red-500">*</span>
              </label>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    // Select all student IDs
                    setSelectedStudents(teamMembers.map(student => student.id));
                    setErrors(prev => ({ ...prev, students: '' }));
                  }}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudents([])}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className={`border rounded-lg p-2 max-h-40 overflow-y-auto space-y-1 ${
              errors.students ? 'border-red-500' : ''
            }`}>
              {teamMembers.length === 0 ? (
                <p className="text-sm text-gray-500 p-2">No team members available</p>
              ) : (
                teamMembers.map(student => (
                  <label
                    key={student.id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="rounded border-gray-300 text-[#9b1a31] focus:ring-[#9b1a31]"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {student.name} ({student.id})
                    </span>
                  </label>
                ))
              )}
            </div>
            {errors.students && (
              <p className="mt-1 text-sm text-red-500">{errors.students}</p>
            )}
          </div>
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
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Assigning...' : 'Assign Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal; 