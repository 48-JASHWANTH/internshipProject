import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import { Calendar, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { useStore } from '@/store/useStore';

const Workboard = ({ projectId }) => {
  const [taskToComplete, setTaskToComplete] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useStore();

  // Fetch tasks directly from the API
  const fetchTasks = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      console.log(`Fetching tasks for project: ${projectId}`);
      
      const response = await apiClient.get(`/student/team/${projectId}/tasks`, {
        withCredentials: true
      });
      
      console.log('Tasks API response:', response.data);
      
      if (response.data.success) {
        // Transform the tasks for frontend use
        const transformedTasks = response.data.tasks.map(task => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate).toISOString().split('T')[0],
          priority: task.priority || 'Medium',
          status: task.status === 'done' ? 'Done' : 
                  task.status === 'approved' ? 'Done' : 
                  task.status === 'in-progress' ? 'In Progress' : 'To-Do',
          assignedBy: {
            type: task.assignedBy?.role || task.assignedBy?.type || 'Guide',
            name: task.assignedBy?.name || 'Faculty',
            facultyID: task.assignedBy?.facultyID || ''
          },
          assignedTo: Array.isArray(task.assignedTo) 
            ? task.assignedTo.join(', ')
            : task.assignedTo || '',
          facultyId: task.assignedBy?.facultyID || task.facultyId || ''
        }));
        
        setTasks(transformedTasks);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch tasks');
        toast.error('Failed to load tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Error loading tasks. Please try again later.');
      toast.error('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

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

  const handleMoveForward = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (task.status === 'In Progress') {
      setTaskToComplete(taskId);
    } else {
      try {
        const response = await apiClient.put(
          `/student/project/task/${projectId}/${taskId}`,
          { status: 'In Progress' },
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success('Task moved to In Progress');
          fetchTasks(); // Refresh tasks after update
        }
      } catch (error) {
        toast.error('Failed to update task status');
        console.error('Error updating task status:', error);
      }
    }
  };

  const handleConfirmComplete = async () => {
    if (taskToComplete) {
      try {
        console.log('Completing task with ID:', taskToComplete);
        const completedTask = tasks.find(t => t._id === taskToComplete);
        console.log('Task details:', completedTask);
        
        if (!completedTask) {
          console.error('Could not find task details for ID:', taskToComplete);
          toast.error('Could not complete task - task details not found');
          return;
        }

        // Update task status in the API
        const updateResponse = await apiClient.put(
          `/student/project/task/${projectId}/${taskToComplete}`,
          { status: 'Done' },
          { withCredentials: true }
        );

        console.log('Task update response:', updateResponse.data);

        if (updateResponse.data.success) {
          // Get faculty ID from the task if available
          const facultyId = completedTask.assignedBy?.facultyID || 
                          completedTask.facultyId || 
                          '00CSE007'; // Default fallback 
          
          console.log('Faculty ID for notification:', facultyId);
          
          // Send notification to the faculty who assigned the task
          try {
            console.log('Preparing task completion notification payload');
            
            // Create notification payload with all necessary details
            const notificationPayload = {
              taskId: taskToComplete,
              taskTitle: completedTask.title,
              studentId: user.studentID,
              studentName: user.name,
              projectId: projectId,
              facultyId: facultyId,
              completedAt: new Date().toISOString()
            };
            
            console.log('Sending notification payload:', notificationPayload);
            
            // Send notification to faculty
            const notificationResponse = await apiClient.post(
              '/api/notifications/task-completion',
              notificationPayload,
              { withCredentials: true }
            );
            
            console.log('Notification response:', notificationResponse.data);
            
            if (notificationResponse.data.success) {
              console.log('Successfully sent task completion notification to faculty');
            } else {
              console.error('Error from notification endpoint:', notificationResponse.data);
            }
          } catch (notificationError) {
            console.error('Error sending task completion notification:', notificationError);
            console.error('Error details:', notificationError.response?.data || 'No response data');
            // Continue with the flow even if notification fails
          }
          
          setTaskToComplete(null);
          toast.success('Task marked as complete and faculty notified');
          fetchTasks(); // Refresh tasks after update
        } else {
          toast.error(updateResponse.data.message || 'Failed to complete task');
        }
      } catch (error) {
        toast.error('Failed to complete task');
        console.error('Error completing task:', error);
        console.error('Error details:', error.response?.data || 'No response data');
      }
    }
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchTasks} 
            className="mt-4 px-4 py-2 bg-[#9b1a31] text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Workboard</h1>
        
        <div className="flex gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="flex flex-col w-1/3">
              <h2 className="font-semibold mb-4 text-gray-700 text-center">
                {column.title} 
                <span className="ml-2 px-2 py-1 bg-gray-200 rounded-full text-xs">
                  {column.items.length}
                </span>
              </h2>
              
              <div className="min-h-[500px] rounded-lg p-4 bg-gray-100">
                {column.items.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200"
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
                          onClick={() => handleMoveForward(task._id)}
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
                ))}
              </div>
            </div>
          ))}
        </div>
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