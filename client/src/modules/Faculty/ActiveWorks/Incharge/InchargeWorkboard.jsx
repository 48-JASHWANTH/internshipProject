import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import AddTaskModal from './components/AddTaskModal';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onStatusChange, onApprove }) => {
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
  const statusLabel = statusConfig[task.status]?.label || 'Unknown';
  const statusColor = statusConfig[task.status]?.color || 'text-gray-500';

  // Determine if task was added by guide or incharge
  const isGuideTask = task.assignedBy?.type === 'Guide';
  const taskTypeColor = isGuideTask ? 'border-l-4 border-l-[#9b1a31]' : 'border-l-4 border-l-blue-500';
  const taskTypeLabel = isGuideTask ? 'Guide Task' : 'Incharge Task';

  // Format date or provide a default
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const handleApproveClick = () => {
    onApprove(task.taskId);
  };

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
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${statusColor}`}>
            <StatusIcon className="w-4 h-4" />
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {task.priority || 'Medium'}
        </span>
        <span className="text-xs flex items-center gap-1 text-gray-500">
          <Calendar className="w-3 h-3" />
          {formatDate(task.dueDate)}
        </span>
        <span className="text-xs flex items-center gap-1 text-gray-500">
          <User className="w-3 h-3" />
          Assigned to: {task.assignedTo || 'Team'}
        </span>
        <span className="text-xs flex items-center gap-1 text-gray-500">
          Assigned by: {task.assignedBy?.name || 'Faculty'}
        </span>
      </div>

      <div>
        {task.status === 'done' && (
          <button
            onClick={handleApproveClick}
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

const InchargeWorkboard = ({ projectId }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { activeProjects, user, fetchLeadedProjects } = useStore();
  
  // Find the team data
  const team = useMemo(() => {
    if (!activeProjects?.teams) return null;
    return activeProjects.teams.find(t => t.teamId === projectId);
  }, [activeProjects, projectId]);
  
  // Get tasks directly from the team object
  const tasks = useMemo(() => {
    return team?.tasks || [];
  }, [team]);
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Update on server
      await apiClient.put(`/faculty/team/${projectId}/task/${taskId}`, {
        status: newStatus
      }, { withCredentials: true });
      
      // Update in store by refreshing the team data
      if (user?.facultyID) {
        await useStore.getState().fetchLeadedProjects(user.facultyID);
      }
      
      toast.success('Task status updated');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };
  
  const handleApprove = async (taskId) => {
    try {
      // Make sure taskId is properly defined and not undefined
      if (!taskId) {
        console.error('Task ID is undefined or empty');
        toast.error('Invalid task ID');
        return;
      }
      
      console.log('Approving task with ID:', taskId); // Add this for debugging
      
      // Update on server
      await apiClient.put(`/faculty/team/${projectId}/task/${taskId}`, {
        status: 'approved'
      }, { withCredentials: true });
      
      // Update in store by refreshing the team data
      if (user?.facultyID) {
        await useStore.getState().fetchLeadedProjects(user.facultyID);
      }
      
      toast.success('Task approved');
    } catch (error) {
      console.error('Error approving task:', error);
      toast.error('Failed to approve task');
    }
  };
  
  // This function will be passed to AddTaskModal
  const handleAddTask = async (taskData) => {
    try {
      setIsLoading(true);
      
      // After the task is added successfully in AddTaskModal
      // Refresh the team data to get the updated tasks
      if (user?.facultyID) {
        await useStore.getState().fetchLeadedProjects(user.facultyID);
      }
      
      // Close the modal after successful refresh
      setIsAddModalOpen(false);
      
      return true; // Indicate success to AddTaskModal
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      return false; // Indicate failure to AddTaskModal
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Log the tasks to see their structure
    console.log('Tasks:', tasks);
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

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

      <div className="max-w-3xl mx-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No tasks have been assigned yet.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 text-[#9b1a31] hover:underline"
            >
              Add the first task
            </button>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onApprove={handleApprove}
            />
          ))
        )}
      </div>

      {isAddModalOpen && (
        <AddTaskModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAddTask={handleAddTask}
          teamMembers={team?.listOfStudents || []}
          projectId={projectId}  // Pass projectId to AddTaskModal
        />
      )}
    </div>
  );
};

export default InchargeWorkboard; 