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

  // Format date or provide a default
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium text-gray-900 text-lg mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${statusColor}`}>
            <StatusIcon className="w-4 h-4" />
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-4">
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
      </div>

      <div>
        {/* <select
          className="text-sm border rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select> */}

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

const InchargeWorkboard = ({ projectId }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { activeProjects, user } = useStore();
  
  // Find the team data
  const team = useMemo(() => {
    if (!activeProjects?.teams) return null;
    return activeProjects.teams.find(t => t.teamId === projectId);
  }, [activeProjects, projectId]);
  
  // Fetch tasks for this team
  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/faculty/team/${projectId}/tasks`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setTasks(response.data.tasks || []);
        } else {
          toast.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Error loading tasks');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [projectId]);
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistically update UI
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
      
      // Update on server
      await apiClient.put(`/faculty/team/${projectId}/task/${taskId}`, {
        status: newStatus
      }, { withCredentials: true });
      
      toast.success('Task status updated');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
      
      // Revert optimistic update on failure
      const response = await apiClient.get(`/faculty/team/${projectId}/tasks`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setTasks(response.data.tasks || []);
      }
    }
  };
  
  const handleApprove = async (taskId) => {
    try {
      // Optimistically update UI
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status: 'approved' } : task
      ));
      
      // Update on server
      await apiClient.put(`/faculty/team/${projectId}/task/${taskId}`, {
        status: 'approved'
      }, { withCredentials: true });
      
      toast.success('Task approved');
    } catch (error) {
      console.error('Error approving task:', error);
      toast.error('Failed to approve task');
      
      // Revert optimistic update on failure
      const response = await apiClient.get(`/faculty/team/${projectId}/tasks`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setTasks(response.data.tasks || []);
      }
    }
  };
  
  const handleAddTask = async (newTask) => {
    try {
      const taskData = {
        ...newTask,
        assignedBy: {
          name: user?.name || 'Faculty',
          type: 'Incharge',
          facultyID: user?.facultyID
        }
      };
      
      const response = await apiClient.post(`/faculty/team/${projectId}/task`, 
        taskData, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Refresh tasks
        const tasksResponse = await apiClient.get(`/faculty/team/${projectId}/tasks`, {
          withCredentials: true
        });
        
        if (tasksResponse.data.success) {
          setTasks(tasksResponse.data.tasks || []);
          toast.success('Task added successfully');
        }
      } else {
        toast.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error adding task');
    } finally {
      setIsAddModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Workboard</h2>
          <p className="text-gray-500">Manage and track student tasks</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
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
        />
      )}
    </div>
  );
};

export default InchargeWorkboard; 