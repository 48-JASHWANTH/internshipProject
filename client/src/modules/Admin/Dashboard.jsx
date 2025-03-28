import React, { useState, useEffect } from 'react';
import { FaUsers, FaChalkboardTeacher, FaProjectDiagram, FaExclamationTriangle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { format, formatDistanceToNow, subDays, isWithinInterval } from 'date-fns';
import Activity from './components/Activity';

const Dashboard = () => {
  // Initialize with zeros instead of static data
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    projects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingApprovals: 0,
    suspiciousActivities: 0,
    newUsersToday: 0
  });

  const [activityData, setActivityData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingAllActivities, setViewingAllActivities] = useState(false);

  // Toggle between dashboard and all activities view
  const toggleViewAll = () => {
    setViewingAllActivities(!viewingAllActivities);
  };

  if (viewingAllActivities) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <Activity onBack={toggleViewAll} />
      </div>
    );
  }

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get dashboard statistics from the API
        const statsResponse = await apiClient.get('/admin/dashboard-stats', {withCredentials: true});
        
        if (statsResponse.data.success) {
          // Update stats with real data from the API
          setStats(prevStats => ({
            ...prevStats,
            ...statsResponse.data.stats,
            // Keep suspiciousActivities if not provided by the API
            suspiciousActivities: statsResponse.data.stats.suspiciousActivities || prevStats.suspiciousActivities
          }));
        }

        // Get activity logs
        const activityResponse = await apiClient.get('/admin/activity/user-activity', {withCredentials: true});
        
        if (activityResponse.data.success && activityResponse.data.logs) {
          const logs = activityResponse.data.logs;
          
          // Process logs for recent activities
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
          
          // Only keep the 5 most recent activities for the dashboard
          setRecentActivities(processedActivities.slice(0, 5));
          
          // Count suspicious activities from logs
          const suspiciousCount = logs.filter(log => 
            log.action.toLowerCase().includes('failed')
          ).length;
          
          // Update suspiciousActivities in stats
          setStats(prevStats => ({
            ...prevStats,
            suspiciousActivities: suspiciousCount
          }));
          
          // CHART 1: Process logs for activity distribution chart
          // Group activities by action type and count by user type
          const activityTypes = {};
          
          logs.forEach(log => {
            // Extract the main action type (first word or up to first space)
            const actionType = log.action.split(' ')[0];
            
            if (!activityTypes[actionType]) {
              activityTypes[actionType] = { 
                name: actionType, 
                count: 0, 
                student: 0, 
                faculty: 0, 
                admin: 0 
              };
            }
            
            activityTypes[actionType].count += 1;
            
            if (log.userType === 'student') {
              activityTypes[actionType].student += 1;
            } else if (log.userType === 'faculty') {
              activityTypes[actionType].faculty += 1;
            } else if (log.userType === 'admin') {
              activityTypes[actionType].admin += 1;
            }
          });
          
          // Convert to array and sort by count (highest first)
          const chartData = Object.values(activityTypes)
            .sort((a, b) => b.count - a.count)
            .slice(0, 7); // Take top 7 activities for better visualization
          
          if (chartData.length > 0) {
            setActivityData(chartData);
          }
          
          // CHART 2: Process logs for weekly activity timeline
          const today = new Date();
          const last7Days = {};
          
          // Initialize the last 7 days with proper date objects
          for (let i = 6; i >= 0; i--) {
            const date = subDays(today, i);
            const dayName = format(date, 'EEE');
            last7Days[dayName] = { 
              date: dayName, 
              fullDate: date,
              logins: 0, 
              activities: 0, 
              projects: 0 
            };
          }
          
          // Fill in the data for each day
          logs.forEach(log => {
            const logDate = new Date(log.timestamp);
            
            // Check if log is within the last 7 days
            const dayKey = Object.keys(last7Days).find(key => {
              const dayDate = last7Days[key].fullDate;
              return logDate.getDate() === dayDate.getDate() && 
                     logDate.getMonth() === dayDate.getMonth() && 
                     logDate.getFullYear() === dayDate.getFullYear();
            });
            
            if (dayKey) {
              last7Days[dayKey].activities += 1;
              
              if (log.action.toLowerCase().includes('login')) {
                last7Days[dayKey].logins += 1;
              }
              
              if (log.action.toLowerCase().includes('project')) {
                last7Days[dayKey].projects += 1;
              }
            }
          });
          
          // Convert to array format for the chart
          const timelineChartData = Object.values(last7Days).map(day => ({
            date: day.date,
            logins: day.logins,
            activities: day.activities,
            projects: day.projects
          }));
          
          if (timelineChartData.length > 0) {
            setTimelineData(timelineChartData);
          }
        }
        
        // Get suspicious activities for the dashboard
        try {
          const suspiciousResponse = await apiClient.get('/admin/activity/suspicious-activities', {withCredentials: true});
          if (suspiciousResponse.data && suspiciousResponse.data.success && Array.isArray(suspiciousResponse.data.activities)) {
            setStats(prevStats => ({
              ...prevStats,
              suspiciousActivities: suspiciousResponse.data.activities.length
            }));
          }
        } catch (error) {
          console.error('Error fetching suspicious activities:', error);
          // Just log the error but don't update the state
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold">{stats.students}</p>
            <p className="text-xs text-green-500 mt-1">+{stats.newUsersToday} today</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaChalkboardTeacher className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Faculty Members</p>
            <p className="text-2xl font-bold">{stats.faculty}</p>
            <p className="text-xs text-red-500 mt-1">{stats.pendingApprovals} pending approvals</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FaProjectDiagram className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-2xl font-bold">{stats.projects}</p>
            <div className="flex text-xs mt-1">
              <span className="text-green-600 mr-2">{stats.activeProjects} Active</span>
              <span className="text-blue-600">{stats.completedProjects} Completed</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enhanced Activity Types Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Activity Distribution by User Type</h2>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
            </div>
          ) : activityData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No activity data available</p>
            </div>
          ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="student" stackId="a" fill="#8884d8" name="Student" />
                <Bar dataKey="faculty" stackId="a" fill="#82ca9d" name="Faculty" />
                <Bar dataKey="admin" stackId="a" fill="#ffc658" name="Admin" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}
        </div>
        
        {/* Weekly Activity Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
            </div>
          ) : timelineData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No timeline data available</p>
            </div>
          ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="logins" stroke="#8884d8" activeDot={{ r: 8 }} name="Logins" />
                <Line type="monotone" dataKey="activities" stroke="#82ca9d" name="Activities" />
                <Line type="monotone" dataKey="projects" stroke="#ffc658" name="New Projects" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          )}
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <button 
            onClick={toggleViewAll}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View All
          </button>
        </div>
        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <FaExclamationTriangle className="mx-auto mb-4 text-4xl text-gray-400" />
            <p>No activities found</p>
          </div>
        ) : (
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
              {recentActivities.map(activity => (
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;