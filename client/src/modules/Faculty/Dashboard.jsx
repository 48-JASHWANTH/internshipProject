import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store/useStore';

const FacultyDashboard = () => {
  // Key metrics
  const [stats, setStats] = useState({
    activeProjects: 0,
    projectsCompleted: 0,
    studentsUnderGuidance: 0,
    pendingApprovals: 0,
    leadedProjects: 0,
    guidedProjects: 0,
    forumProjects: 0
  });

  const [activeProjects, setActiveProjects] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [interestedStudents, setInterestedStudents] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);
  const [projectDistributionData, setProjectDistributionData] = useState([]);
  const [facultyInfo, setFacultyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user from store (optional)
  const { user } = useStore();
  //console.log(user.facultyID);
  const facultyId = user?.facultyID; // Fallback to default if no user in store

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        //console.log("Requesting dashboard data for faculty:", facultyId);
        const response = await apiClient.get(`faculty/dashboard/${facultyId}`, {withCredentials: true});
        
        // Log the entire response for debugging
        //console.log("Full API Response:", response);
        
        // Log specific parts of the response
        //console.log("Response status:", response.status);
        //console.log("Response data:", response.data);
        
        if (response.data.success) {
          const { dashboardData } = response.data;
          //console.log("Dashboard data structure:", Object.keys(dashboardData));
          
          // Set faculty info
          setFacultyInfo(dashboardData.faculty);
          //console.log("Faculty info:", dashboardData.faculty);
          
          // Set stats
          setStats(dashboardData.stats);
          //console.log("Stats:", dashboardData.stats);
          
          // Set project data
          setActiveProjects(dashboardData.activeProjects || []);
          //console.log("Active projects:", dashboardData.activeProjects);
          
          setArchivedProjects(dashboardData.archivedProjects || []);
          //console.log("Archived projects:", dashboardData.archivedProjects);
          
          // Set visualization data
          setWorkloadData(dashboardData.workloadData || []);
          //console.log("Workload data:", dashboardData.workloadData);
          
          setProjectDistributionData(dashboardData.projectDistributionData || []);
          //console.log("Project distribution data:", dashboardData.projectDistributionData);
          
          // Set student data
          setInterestedStudents(dashboardData.interestedStudents || []);
        } else {
          //console.error("API returned success:false", response.data);
          toast.error('Failed to load dashboard data');
        }
      } catch (error) {
        //console.error('Error fetching dashboard data:', error);
        //console.error('Error details:', error.response || error.message);
        toast.error('Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (facultyId) {
      fetchDashboardData();
    } else {
      //console.error("No faculty ID available. User:", user);
      setIsLoading(false);
      toast.error('Faculty ID not found. Please log in again.');
    }
  }, [facultyId]);

  // Time based greeting
  const getTimeBasedGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

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

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header with dynamic faculty info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {getTimeBasedGreeting()}, {facultyInfo?.name || "Faculty"}
        </h1>
        <p className="text-gray-500 mt-1">
          {facultyInfo?.facultyID || ""} | {facultyInfo?.department || ""}
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
              <p className="text-2xl font-bold text-gray-800">{stats.activeProjects}</p>
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
              <p className="text-2xl font-bold text-gray-800">{stats.projectsCompleted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Students Under Guidance</p>
              <p className="text-2xl font-bold text-gray-800">{stats.studentsUnderGuidance}</p>
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
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Workload Chart */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Workload Overview</h2>
          {workloadData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workloadData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 15 }} />
                <Bar name="Assigned Projects" dataKey="assigned" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar name="Completed Projects" dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>No workload data available</p>
            </div>
          )}
        </div>
        
        {/* Project Distribution */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Distribution</h2>
          {projectDistributionData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {projectDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>No project distribution data available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Projects and Archived Projects Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Active Projects */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-lg font-semibold text-gray-800">Active Projects</h2>
            <Link to="/Faculty/ActiveWorks/Guide" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All</Link>
          </div>
          
          {activeProjects.length > 0 ? (
            <div className="space-y-6">
              {activeProjects.map(project => (
                <div key={project.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-100 transition-all duration-200">
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-medium text-gray-800 text-base">{project.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Class: {project.class}</p>
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
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No active projects found</p>
            </div>
          )}
        </div>
        
        {/* Archived Projects */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-lg font-semibold text-gray-800">Archived Projects</h2>
            <Link to="/Faculty/ArchivedProjects/Guide" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All</Link>
          </div>
          
          {archivedProjects.length > 0 ? (
            <div className="space-y-4">
              {archivedProjects.map(project => (
                <div key={project.id} className="flex justify-between items-center p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors duration-200">
                  <div>
                    <h3 className="font-medium text-gray-800 text-base">{project.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Class: {project.class}</p>
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
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No archived projects found</p>
            </div>
          )}
        </div>
      </div>

      {/* Student Applications */}
      <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-lg font-semibold text-gray-800">Student Applications</h2>
          <Link to="/faculty/ProjectForum?tab=my-projects" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All</Link>
        </div>
        
        {interestedStudents.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Student</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Roll No.</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Email</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Applied On</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {interestedStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {student.rollNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(student.appliedOn).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {student.project}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 border border-gray-100 rounded-lg">
            <p>No student applications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;