import React, { useState, useMemo } from 'react';
import { Plus, Calendar, User, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '@/store/useStore';
import AddTaskModal from './components/AddTaskModal';

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
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium text-gray-900 text-lg mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${statusConfig[task.status]?.color || 'text-gray-500'}`}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig[task.status]?.label || 'To Do'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-4">
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
      </div>

      <div >
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

  const handleApprove = (taskId) => {
    updateGuidedProjectTask(projectId, taskId, { status: 'approved' });
  };

  const handleAddTask = (newTask) => {
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
    
    // Add to store
    addGuidedProjectTask(projectId, taskWithFaculty);
    
    // Close modal
    setIsAddModalOpen(false);
  };

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

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            This project doesn't have any tasks yet. Add a task to help the team organize their work.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors"
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
        />
      )}
    </div>
  );
};

export default GuideWorkboard; 