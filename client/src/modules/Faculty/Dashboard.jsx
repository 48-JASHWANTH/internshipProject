import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  // Key metrics
  const [stats, setStats] = useState({
    activeProjects: 3,
    projectsCompleted: 6,
    studentsUnderGuidance: 15,
    pendingApprovals: 3
  });

  const [activeProjects, setActiveProjects] = useState([
    { 
      id: 1, 
      name: 'AI Healthcare System', 
      class: 'CSE-A',
      progress: 75,
      projectType: 'Major'
    },
    { 
      id: 2, 
      name: 'Smart IoT Platform', 
      class: 'AIDS',
      progress: 60,
      projectType: 'Mini'
    },
    { 
      id: 3, 
      name: 'Data Analytics System', 
      class: 'CSBS',
      progress: 45,
      projectType: 'CBP'
    }
  ]);

  const [archivedProjects, setArchivedProjects] = useState([
    { 
      id: 1, 
      name: 'Machine Learning Model', 
      class: 'CSE-B',
      completedDate: '2024-02-15',
      projectType: 'Major'
    },
    { 
      id: 2, 
      name: 'Blockchain Application', 
      class: 'CSBS',
      completedDate: '2024-01-20',
      projectType: 'Mini'
    },
    { 
      id: 3, 
      name: 'Smart City Platform', 
      class: 'AIDS',
      completedDate: '2023-12-05',
      projectType: 'CBP'
    }
  ]);

  const [interestedStudents, setInterestedStudents] = useState([
    { id: 1, rollNo: '21CS45', name: 'Alice Johnson', email: 'alice.j@university.edu', appliedOn: '2024-03-15', project: 'AI Healthcare System' },
    { id: 2, rollNo: '21CS32', name: 'Bob Smith', email: 'bob.s@university.edu', appliedOn: '2024-03-18', project: 'Smart IoT Platform' },
    { id: 3, rollNo: '22CS10', name: 'Carol Davis', email: 'carol.d@university.edu', appliedOn: '2024-03-20', project: 'Data Analytics System' }
  ]);

  // Workload data for visualization
  const workloadData = [
    { month: 'Jan', assigned: 5, completed: 4 },
    { month: 'Feb', assigned: 8, completed: 7 },
    { month: 'Mar', assigned: 12, completed: 9 },
    { month: 'Apr', assigned: 10, completed: 8 }
  ];

  // Project distribution
  const projectDistributionData = [
    { name: 'Major', value: 35, color: '#8884d8' },
    { name: 'Mini', value: 25, color: '#82ca9d' },
    { name: 'CBP', value: 20, color: '#ffc658' },
    { name: 'FP', value: 20, color: '#ff8042' }
  ];


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

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{getTimeBasedGreeting()}, Dr. Johnson</h1>
        <p className="text-gray-500 mt-1"> FAC1001 | Computer Science</p>
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
        </div>
        
        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Distribution</h2>
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
                >
                  {projectDistributionData.map((entry, index) => (
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
            <Link to="/Faculty/ActiveWorks/Guide" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All</Link>
          </div>
          
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
        </div>
        
        {/* Archived Projects */}
        <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-lg font-semibold text-gray-800">Archived Projects</h2>
            <Link to="/Faculty/ArchivedProjects/Guide" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All</Link>
          </div>
          
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
        </div>
      </div>

      {/* Student Applications */}
      <div className="bg-white rounded-xl shadow-md p-7 border border-gray-100">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-lg font-semibold text-gray-800">Student Applications</h2>
          <Link to="/faculty/ProjectForum?tab=my-projects" className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 px-4 py-1.5 rounded-md">View All</Link>
        </div>
        
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
      </div>
    </div>
  );
};

export default FacultyDashboard;