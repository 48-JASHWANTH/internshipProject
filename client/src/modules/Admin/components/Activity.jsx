import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const Activity = ({ onBack }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 10;

  // Get current activities for pagination
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = activities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(activities.length / activitiesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch data from API
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/admin/activity/user-activity', {withCredentials: true});
        
        if (response.data.success && response.data.logs) {
          const logs = response.data.logs;
          
          // Process logs for activities
          const processedActivities = logs.map(log => {
            // Use userId if userName is not available
            const hasUserName = log.userName && log.userName !== log.userId;
            const name = hasUserName ? log.userName : log.userId;
            
            // Create initials from name or userId
            const initials = name.split(' ')
              .map(part => part.charAt(0))
              .join('')
              .toUpperCase();
            
            // Determine status based on action
            let status = 'Completed';
            if (log.action.toLowerCase().includes('failed')) {
              status = 'Suspicious';
            } else if (log.action.toLowerCase().includes('pending') || log.action.toLowerCase().includes('request')) {
              status = 'Pending Approval';
            }
            
            // Format relative time
            const timeAgo = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
            
            return {
              id: log._id,
              user: { 
                name: name,
                id: log.userId, 
                type: log.userType,
                initials: initials,
                showIdSeparately: hasUserName
              },
              activity: log.action,
              details: log.details,
              time: timeAgo,
              timestamp: new Date(log.timestamp),
              status: status
            };
          });
          
          // Sort activities by timestamp (newest first)
          processedActivities.sort((a, b) => b.timestamp - a.timestamp);
          
          setActivities(processedActivities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to load activity data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-2 text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="inline mr-1" />
            </button>
            All Activities
          </div>
        </h2>
      </div>
      
      {isLoading ? (
        <div className="py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <FaExclamationTriangle className="mx-auto mb-4 text-4xl text-gray-400" />
          <p>No activities found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentActivities.map(activity => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">{activity.user.initials}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{activity.user.name}</div>
                          {activity.user.showIdSeparately && (
                            <div className="text-sm text-gray-500">{activity.user.id}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.activity}</div>
                      {activity.details && (
                        <div className="text-xs text-gray-500">{activity.details}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === i + 1 
                        ? 'z-10 bg-[#9b1a31] border-[#9b1a31] text-white' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Activity; 