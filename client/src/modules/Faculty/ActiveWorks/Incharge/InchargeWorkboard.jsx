import React, { useState } from 'react';
import { Plus, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import AddTaskModal from './components/AddTaskModal';

const initialTasks = [
  {
    id: '1',
    title: 'Literature Review',
    description: 'Complete comprehensive literature survey for the project',
    dueDate: '2024-04-01',
    priority: 'High',
    status: 'todo',
    assignedTo: 'John Doe, Jane Smith, '
  },
  {
    id: '2',
    title: 'Technical Review',
    description: 'Review code implementation',
    dueDate: '2024-04-15',
    priority: 'Medium',
    status: 'in_progress',
    assignedTo: 'John Doe'
  },
  {
    id: '3',
    title: 'Database Design',
    description: 'Design and implement database schema',
    dueDate: '2024-03-25',
    priority: 'Medium',
    status: 'done',
    assignedTo: 'John Doe'
  },
  {
    id: '4',
    title: 'Project Setup',
    description: 'Initial project configuration and setup',
    dueDate: '2024-03-15',
    priority: 'Low',
    status: 'approved',
    assignedTo: 'John Doe'
  }
];

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

  const StatusIcon = statusConfig[task.status].icon;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium text-gray-900 text-lg mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${statusConfig[task.status].color}`}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig[task.status].label}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs flex items-center gap-1 text-gray-500">
          <Calendar className="w-3 h-3" />
          {format(new Date(task.dueDate), 'MMM dd, yyyy')}
        </span>
        <span className="text-xs flex items-center gap-1 text-gray-500">
          <User className="w-3 h-3" />
          Assigned to: {task.assignedTo}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <select
          className="text-sm border rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-[#9b1a31] focus:border-[#9b1a31] outline-none"
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {task.status === 'done' && (
          <button
            onClick={() => onApprove(task.id)}
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

const InchargeWorkboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleApprove = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'approved' } : task
    ));
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

      <div className="max-w-3xl mx-auto">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange}
            onApprove={handleApprove}
          />
          ))}
        </div>

      {isAddModalOpen && (
        <AddTaskModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};

export default InchargeWorkboard; 