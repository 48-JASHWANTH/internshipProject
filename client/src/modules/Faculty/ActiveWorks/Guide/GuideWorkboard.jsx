import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, MoreVertical } from 'lucide-react';

const Workboard = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: '1', title: 'Review Documentation', description: 'Check project documentation for completeness' },
      { id: '2', title: 'Technical Review', description: 'Review code implementation' }
    ],
    inProgress: [
      { id: '3', title: 'Database Design Review', description: 'Evaluate database schema' }
    ],
    completed: [
      { id: '4', title: 'Initial Meeting', description: 'Kick-off meeting with team' }
    ]
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(tasks[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setTasks({
        ...tasks,
        [source.droppableId]: items
      });
    } else {
      const sourceItems = Array.from(tasks[source.droppableId]);
      const destItems = Array.from(tasks[destination.droppableId]);
      const [removedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removedItem);

      setTasks({
        ...tasks,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Project Workboard</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A]">
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <div key={columnId} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold capitalize mb-4">
                {columnId.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600">{task.description}</p>
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
  );
};

export default Workboard; 