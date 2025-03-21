import React, { useState, useEffect } from 'react';
import { FaUsers, FaChalkboardTeacher, FaProjectDiagram, FaExclamationTriangle, FaCalendarCheck, FaUserGraduate, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { apiClient } from '@/lib/api-client';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 1245,
    faculty: 87,
    projects: 156,
    activeProjects: 98,
    completedProjects: 58,
    pendingApprovals: 12,
    suspiciousActivities: 3,
    newUsersToday: 8,
    activeUsers: 432
  });

  const [activityData, setActivityData] = useState([
    { name: 'Login', count: 450, student: 380, faculty: 65, admin: 5 },
    { name: 'Project Creation', count: 78, student: 15, faculty: 63, admin: 0 },
    { name: 'Profile Update', count: 120, student: 95, faculty: 22, admin: 3 },
    { name: 'Password Reset', count: 45, student: 38, faculty: 6, admin: 1 },
    { name: 'Document Upload', count: 95, student: 80, faculty: 15, admin: 0 },
    { name: 'Project Submission', count: 62, student: 62, faculty: 0, admin: 0 },
    { name: 'Review', count: 43, student: 0, faculty: 43, admin: 0 }
  ]);

  const [timelineData, setTimelineData] = useState([
    { date: 'Mon', logins: 120, activities: 250, projects: 12 },
    { date: 'Tue', logins: 150, activities: 300, projects: 15 },
    { date: 'Wed', logins: 180, activities: 320, projects: 18 },
    { date: 'Thu', logins: 170, activities: 280, projects: 14 },
    { date: 'Fri', logins: 200, activities: 350, projects: 20 },
    { date: 'Sat', logins: 50, activities: 90, projects: 5 },
    { date: 'Sun', logins: 30, activities: 50, projects: 2 }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      user: { name: 'John Smith', id: '22071A3262', type: 'student', initials: 'JS' },
      activity: 'Submitted project report',
      time: '10 minutes ago',
      status: 'Completed'
    },
    {
      id: 2,
      user: { name: 'Jane Doe', id: 'FAC12346', type: 'faculty', initials: 'JD' },
      activity: 'Created new project',
      time: '25 minutes ago',
      status: 'Pending Approval'
    },
    {
      id: 3,
      user: { name: 'Robert Johnson', id: '22071A3264', type: 'student', initials: 'RJ' },
      activity: 'Multiple failed login attempts',
      time: '1 hour ago',
      status: 'Suspicious'
    },
    {
      id: 4,
      user: { name: 'Sarah Williams', id: 'FAC12348', type: 'faculty', initials: 'SW' },
      activity: 'Updated project deadline',
      time: '2 hours ago',
      status: 'Completed'
    },
    {
      id: 5,
      user: { name: 'Michael Brown', id: '22071A3265', type: 'student', initials: 'MB' },
      activity: 'Requested password reset',
      time: '3 hours ago',
      status: 'Completed'
    }
  ]);

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get user statistics
        const statsResponse = await apiClient.get('/admin/activity/user-statistics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth-storage')}`
          }
        });
        
        if (statsResponse.data.success) {
          // Update stats with real data
          setStats(prevStats => ({
            ...prevStats,
            activeUsers: statsResponse.data.statistics.activeUsers || prevStats.activeUsers,
            // Map other stats as they become available from the API
          }));
        }

        // Get activity logs
        const activityResponse = await apiClient.get('/admin/activity/user-activity', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth-storage')}`
          }
        });
        
        if (activityResponse.data.success && activityResponse.data.logs) {
          // Process logs to create activity data
          // This would need to be adapted based on your actual API response structure
          const logs = activityResponse.data.logs;
          
          // Example processing:
          const processedActivities = logs.slice(0, 5).map(log => ({
            id: log._id,
            user: { 
              name: log.userName || 'Unknown User', 
              id: log.userId, 
              type: log.userType,
              initials: (log.userName || 'UN').split(' ').map(n => n[0]).join('')
            },
            activity: log.action,
            time: new Date(log.timestamp).toRelative(), // You might need a utility for this
            status: log.action.includes('Failed') ? 'Suspicious' : 'Completed'
          }));
          
          setRecentActivities(processedActivities);
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep using mock data if API fails
      }
    };
    
    // Uncomment to enable API fetching
    // fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold">{stats.students}</p>
            <p className="text-xs text-green-500">+{stats.newUsersToday} today</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaChalkboardTeacher className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Faculty</p>
            <p className="text-2xl font-bold">{stats.faculty}</p>
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
        
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <FaChartLine className="text-yellow-600 text-xl" />
          </div>
    <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
            <p className="text-xs text-red-500 mt-1">{stats.suspiciousActivities} suspicious activities</p>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Enhanced Activity Types Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Activity Distribution by User Type</h2>
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
        </div>
        
        {/* Weekly Activity Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
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
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
        </div>
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
                        <div className="text-sm text-gray-500">{activity.user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.activity}
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
      </div>
    </div>
  );
};

export default Dashboard;