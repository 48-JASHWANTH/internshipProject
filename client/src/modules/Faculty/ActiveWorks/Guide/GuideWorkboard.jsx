import React, { useState, useMemo } from 'react';
import { Plus, Calendar, User, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '@/store/useStore';
import AddTaskModal from './Components/AddTaskModal';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

const TaskCard = ({ task, onApprove }) => {
  const priorityColors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusConfig = {
    todo: {
      label: 'To Do',
      icon: XCircle,
      color: 'text-gray-500'
    },
    in_progress: {
      label: 'In Progress',
      icon: Clock,
      color: 'text-blue-500'
    },
    done: {
      label: 'Done',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle,
      color: 'text-purple-500'
    }
  };

  const StatusIcon = statusConfig[task.status]?.icon || XCircle;
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  // Determine if task was added by guide or incharge
  const isGuideTask = task.assignedBy?.type === 'Guide';
  const taskTypeColor = isGuideTask ? 'border-l-4 border-l-[#9b1a31]' : 'border-l-4 border-l-blue-500';
  const taskTypeLabel = isGuideTask ? 'Guide Task' : 'Incharge Task';

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 mb-4 ${taskTypeColor}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
        <div className="w-full sm:w-auto">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 text-lg">{task.title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isGuideTask ? 'bg-[#9b1a31]/10 text-[#9b1a31]' : 'bg-blue-100 text-blue-800'}`}>
              {taskTypeLabel}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex items-center self-start sm:self-auto mt-2 sm:mt-0">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${statusConfig[task.status]?.color || 'text-gray-500'}`}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig[task.status]?.label || 'To Do'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {task.priority || 'Medium'}
        </span>
        <span className="text-xs flex items-center gap-1 text-gray-500">
          <Calendar className="w-3 h-3" />
          {dueDate ? format(dueDate, 'MMM dd, yyyy') : 'No due date'}
        </span>
        <span className="text-xs flex items-center gap-1 text-gray-500">
          <User className="w-3 h-3" />
          Assigned to: {task.assignedTo || 'Unassigned'}
        </span>
        <span className="text-xs flex items-center gap-1 text-gray-500">
          Assigned by: {task.assignedBy?.name || 'Faculty'}
        </span>
      </div>

      <div>
        {task.status === 'done' && (
          <button
            onClick={() => onApprove(task._id)}
            className="px-4 py-1.5 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors text-sm flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

const GuideWorkboard = ({ projectId, project }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, updateGuidedProjectTask, addGuidedProjectTask } = useStore();

  const tasks = useMemo(() => {
    if (!project || !project.tasks) return [];
    
    // Sort tasks by due date (closest first)
    return [...project.tasks].sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date(9999, 11, 31);
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date(9999, 11, 31);
      return dateA - dateB;
    });
  }, [project]);

  const handleStatusChange = (taskId, newStatus) => {
    updateGuidedProjectTask(projectId, taskId, { status: newStatus });
  };

  const handleApprove = async (taskId) => {
    try {
      // Make sure taskId is properly defined and not undefined
      if (!taskId) {
        console.error('Task ID is undefined or empty');
        toast.error('Invalid task ID');
        return;
      }
      
      console.log('Approving task with ID:', taskId);
      
      // Find the task to get its taskId
      const task = tasks.find(t => t._id === taskId);
      if (!task || !task.taskId) {
        console.error('Task not found or missing taskId');
        toast.error('Task not found');
        return;
      }
      
      // Update on server using task.taskId
      await apiClient.put(`/faculty/team/${projectId}/task/${task.taskId}`, {
        status: 'approved'
      }, { withCredentials: true });
      
      // Update in store
      updateGuidedProjectTask(projectId, taskId, { status: 'approved' });
      
      toast.success('Task approved');
    } catch (error) {
      console.error('Error approving task:', error);
      toast.error('Failed to approve task');
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      console.log('Guide - handleAddTask called with:', newTask);
      
      // Add faculty information to the task
      const taskWithFaculty = {
        ...newTask,
        assignedBy: {
          name: user?.name || 'Faculty',
          type: 'Guide',
          facultyID: user?.facultyID || ''
        },
        createdAt: new Date().toISOString()
      };
      
      // Make API call to save task to database
      const response = await apiClient.post(
        `/faculty/team/${projectId}/task`,
        taskWithFaculty,
        { withCredentials: true }
      );
      
      console.log('Guide - Task saved to database:', response.data);
      
      // Add to store
      await addGuidedProjectTask(projectId, taskWithFaculty);
      console.log('Guide - Task added to store successfully');
      
      toast.success('Task added successfully');
      
      // Return true to indicate success and trigger the success dialog in AddTaskModal
      return true;
    } catch (error) {
      console.error('Guide - Error adding task:', error);
      toast.error('Failed to add task');
      return false;
    }
  };

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Project Workboard</h2>
          <p className="text-gray-500">Manage and track student tasks</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">Add Task</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl p-4 sm:p-8 shadow-sm text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
            This project doesn't have any tasks yet. Add a task to help the team organize their work.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors text-sm sm:text-base"
          >
            Add First Task
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onApprove={handleApprove}
            />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddTaskModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAddTask={handleAddTask}
          teamMembers={project?.listOfStudents || []}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default GuideWorkboard; 