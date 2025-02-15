import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useTaskStore from '../../store/taskStore';
import { FaArrowRight, FaCheck } from 'react-icons/fa';

const Workboard = () => {
  const { tasks, updateTask, moveTaskForward } = useTaskStore();
  const [enabled, setEnabled] = useState(false);

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

    // Find the task that was dragged
    const task = tasks.find(t => t.id.toString() === draggableId);
    
    if (task) {
      // Update the task's status to the new column
      const updatedTask = {
        ...task,
        status: destination.droppableId
      };
      
      // Update the task in the store
      updateTask(updatedTask);
    }
  };

  const getAreaColor = (area) => {
    const colors = {
      'Performance Marketing': 'bg-green-50 text-green-700',
      'Product Marketing': 'bg-blue-50 text-blue-700',
      'Event Management': 'bg-yellow-50 text-yellow-700',
      'Sales': 'bg-red-50 text-red-700'
    };
    return colors[area] || 'bg-gray-50 text-gray-700';
  };

  const handleMoveForward = (taskId) => {
    moveTaskForward(taskId);
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
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}
                                hover:shadow-md transition-all duration-200
                              `}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-500">
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
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
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
                                  <span className="font-medium text-gray-500">Deadline:</span>
                                  <span className="px-2 py-1 bg-gray-100 rounded">
                                    {task.deadline}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded text-xs ${getAreaColor(task.area)}`}>
                                    {task.area}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-medium text-gray-500">Assigned:</span>
                                  <span className="text-gray-600">{task.assignedFaculty}</span>
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
    </div>
  );
};

export default Workboard; 