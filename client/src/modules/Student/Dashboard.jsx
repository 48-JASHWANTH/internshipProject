import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    studentInfo: null,
    stats: {
      activeProjects: 0,
      completedProjects: 0,
      pendingTasks: 0
    },
    activeProjects: [],
    archivedProjects: [],
    taskCompletionData: [],
    projectDistributionData: [],
    forumProjects: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/student/dashboard-data/${user.studentID}`, {
          withCredentials: true
        });

        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.studentID) {
      fetchDashboardData();
    }
  }, [user?.studentID]);

  // Project type styling
  const getProjectTypeStyle = (type) => {
    switch (type) {
      case 'Major': return 'bg-purple-100 text-purple-800';
      case 'Mini': return 'bg-blue-100 text-blue-800';
      case 'CBP': return 'bg-amber-100 text-amber-800';
      case 'FP': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeBasedGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#82001A]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {getTimeBasedGreeting()}, {dashboardData.studentInfo?.name}
        </h1>
        <p className="text-gray-500 mt-1">
          {dashboardData.studentInfo?.studentID} | {dashboardData.studentInfo?.department}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.activeProjects}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Projects</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.completedProjects}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-50 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.pendingTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Forum Projects</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.forumProjects.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Task Completion Chart */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Task Completion</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.taskCompletionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 15 }} />
              <Bar name="Assigned Tasks" dataKey="assigned" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar name="Completed Tasks" dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Project Distribution */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.projectDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.projectDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Active Projects and Archived Projects Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Active Projects */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-lg font-semibold text-gray-800">Active Projects</h2>
            <Link to="/Student/ActiveWorks" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All</Link>
          </div>
          
          <div className="space-y-6">
            {dashboardData.activeProjects.map(project => (
              <div key={project.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-100 transition-all duration-200">
                <div className="mb-3 md:mb-0">
                  <h3 className="font-medium text-gray-800 text-base">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Guide: {project.facultyGuide}</p>
                </div>
                
                <div className="flex flex-col w-full md:w-1/2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-blue-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        project.progress > 75 ? 'bg-green-500' : 
                        project.progress > 50 ? 'bg-blue-500' : 
                        project.progress > 25 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                      aria-valuenow={project.progress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Archived Projects */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-lg font-semibold text-gray-800">Archived Projects</h2>
            <Link to="/Student/ArchivedProjects" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All Archives</Link>
          </div>
          
          <div className="space-y-4">
            {dashboardData.archivedProjects.map(project => (
              <div key={project.id} className="flex justify-between items-center p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors duration-200">
                <div>
                  <h3 className="font-medium text-gray-800 text-base">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Guide: {project.facultyGuide}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getProjectTypeStyle(project.projectType)}`}>
                    {project.projectType}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    Completed: {new Date(project.completedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Forum */}
      <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-lg font-semibold text-gray-800">Project Forum</h2>
          <Link to="/Student/ProjectForum" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All Projects</Link>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Project Title</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Faculty</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Domain</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {dashboardData.forumProjects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {project.title}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {project.faculty}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {project.domain}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {project.status}
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

export default StudentDashboard;
