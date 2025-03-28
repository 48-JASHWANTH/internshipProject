import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import { Calendar, User } from 'lucide-react';

// Static tasks data
const initialTasks = [
  {
    id: '1743145152416',
    title: 'Literature Review',
    description: 'Complete comprehensive literature survey for the project',
    dueDate: '2024-04-01',
    priority: 'High',
    status: 'To-Do',
    assignedBy: { type: 'Incharge', name: 'Dr. Robert Smith' },
    assignedTo: 'John Doe, Jane Smith, Mike Johnson'
  },
  {
    id: '1743145152417',
    title: 'Technical Review',
    description: 'Review code implementation and architecture',
    dueDate: '2024-04-15',
    priority: 'Medium',
    status: 'In Progress',
    assignedBy: { type: 'Guide', name: 'Dr. Sarah Johnson' },
    assignedTo: 'John Doe, Jane Smith'
  },
  {
    id: '1743145152418',
    title: 'Database Design',
    description: 'Design and implement database schema',
    dueDate: '2024-03-25',
    priority: 'Medium',
    status: 'Done',
    assignedBy: { type: 'Incharge', name: 'Dr. Robert Smith' },
    assignedTo: 'John Doe, Mike Johnson'
  },
  {
    id: '1743145152419',
    title: 'Project Setup',
    description: 'Initial project configuration and setup',
    dueDate: '2024-03-15',
    priority: 'Low',
    status: 'Done',
    assignedBy: { type: 'Guide', name: 'Dr. Sarah Johnson' },
    assignedTo: 'John Doe, Jane Smith, Mike Johnson'
  }
];

const Workboard = () => {
  const [enabled, setEnabled] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);

  // Enable drag and drop after component mount to avoid hydration issues
  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const columns = {
    'To-Do': {
      title: 'TO DO',
      items: tasks.filter(task => task.status === 'To-Do')
    },
    'In Progress': {
      title: 'IN PROGRESS',
      items: tasks.filter(task => task.status === 'In Progress')
    },
    'Done': {
      title: 'COMPLETED',
      items: tasks.filter(task => task.status === 'Done')
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const task = tasks.find(t => t.id.toString() === draggableId);
    
    if (task) {
      const updatedTasks = tasks.map(t => {
        if (t.id === task.id) {
          return { ...t, status: destination.droppableId };
        }
        return t;
      });
      setTasks(updatedTasks);
    }
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  const handleMoveForward = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task.status === 'In Progress') {
      setTaskToComplete(taskId);
    } else {
      const updatedTasks = tasks.map(t => {
        if (t.id === taskId) {
          const newStatus = t.status === 'To-Do' ? 'In Progress' : t.status;
          return { ...t, status: newStatus };
        }
        return t;
      });
      setTasks(updatedTasks);
    }
  };

  const handleConfirmComplete = () => {
    if (taskToComplete) {
      const updatedTasks = tasks.map(t => {
        if (t.id === taskToComplete) {
          return { ...t, status: 'Done' };
        }
        return t;
      });
      setTasks(updatedTasks);
      setTaskToComplete(null);
    }
  };

  if (!enabled) {
    return null;
  }

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Workboard</h1>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6">
            {Object.entries(columns).map(([columnId, column]) => (
              <div key={columnId} className="flex flex-col w-1/3">
                <h2 className="font-semibold mb-4 text-gray-700 text-center">
                  {column.title} 
                  <span className="ml-2 px-2 py-1 bg-gray-200 rounded-full text-xs">
                    {column.items.length}
                  </span>
                </h2>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[500px] rounded-lg p-4 ${
                        snapshot.isDraggingOver ? 'bg-gray-50' : 'bg-gray-100'
                      }`}
                    >
                      {column.items.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                bg-white rounded-lg p-4 mb-3 shadow-sm
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-[#82001A]' : ''}
                                hover:shadow-md transition-all duration-200
                              `}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#82001A]">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                                    </svg>
                                  </span>
                                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                                </div>
                                {task.status !== 'Done' && (
                                  <button
                                    onClick={() => handleMoveForward(task.id)}
                                    className="p-2 text-[#82001A] hover:bg-yellow-50 rounded-full transition-colors"
                                    title={task.status === 'To-Do' ? 'Move to In Progress' : 'Mark as Complete'}
                                  >
                                    {task.status === 'To-Do' ? <FaArrowRight size={14} /> : <FaCheck size={14} />}
                                  </button>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">
                                {task.description}
                              </p>
                              
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-500">Deadline:</span>
                                    <span className="px-2 py-1 bg-gray-100 rounded">
                                      {task.dueDate}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    <span className={`px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                                      {task.priority} 
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs">
                                  <User className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-500">Assigned by:</span>
                                  <span className="text-gray-600">
                                    {task.assignedBy.name} ({task.assignedBy.type})
                                  </span>
                                </div>  
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
      
      {/* Confirmation Modal */}
      {taskToComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Task Completion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this task as complete?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTaskToComplete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmComplete}
                className="px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#6b0016] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workboard; 