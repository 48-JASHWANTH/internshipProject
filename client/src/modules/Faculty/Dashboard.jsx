import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const FacultyDashboard = () => {
  // Sample data - in a real app this would come from API calls
  const [overviewData, setOverviewData] = useState({
    studentResponses: 24,
    pendingReviews: 8,
    studentsUnderGuidance: 15,
    projectsCompleted: 6
  });

  const [activeProjects, setActiveProjects] = useState([
    { id: 1, name: 'AI Healthcare System', team: 'Team Alpha', progress: 75, dueDate: 'Oct 2024-03-30' },
    { id: 2, name: 'Smart IoT Platform', team: 'Team Beta', progress: 60, dueDate: 'Oct 2024-04-15' },
    { id: 3, name: 'Data Analytics System', team: 'Team Gamma', progress: 45, dueDate: 'Oct 2024-05-10' }
  ]);

  const [interestedStudents, setInterestedStudents] = useState([
    { id: 1, rollNo: '21CS45', name: 'Alice Johnson', email: 'alice.j@university.edu', appliedOn: '2024-03-15' },
    { id: 2, rollNo: '21CS32', name: 'Bob Smith', email: 'bob.s@university.edu', appliedOn: '2024-03-18' },
    { id: 3, rollNo: '22CS10', name: 'Carol Davis', email: 'carol.d@university.edu', appliedOn: '2024-03-20' }
  ]);

  const [activities, setActivities] = useState([
    { id: 1, message: 'New student application for AI Research Project', action: 'View Details', time: '2h ago' },
    { id: 2, message: 'Review submission pending for Team Beta', action: 'Go to Reviews', time: '3h ago' },
    { id: 3, message: 'Project "Machine Learning Model" marked as completed', action: 'View Project', time: '1d ago' }
  ]);

  // Chart data
  const projectTrendData = [
    { semester: 'Fall 2022', count: 4 },
    { semester: 'Spring 2023', count: 6 },
    { semester: 'Fall 2023', count: 5 },
    { semester: 'Spring 2024', count: 7 }
  ];

  const studentPerformanceData = [
    { name: 'Excellent', value: 35, color: '#4CAF50' },
    { name: 'Good', value: 40, color: '#2196F3' },
    { name: 'Average', value: 15, color: '#FFC107' },
    { name: 'Needs Improvement', value: 10, color: '#F44336' }
  ];

  const workloadData = [
    { name: 'Jan', assigned: 5, completed: 4 },
    { name: 'Feb', assigned: 8, completed: 7 },
    { name: 'Mar', assigned: 12, completed: 9 },
    { name: 'Apr', assigned: 10, completed: 8 }
  ];

  const handleAcceptStudent = (id) => {
    // Implementation would connect to backend API
    setInterestedStudents(interestedStudents.filter(student => student.id !== id));
  };

  const handleRejectStudent = (id) => {
    // Implementation would connect to backend API
    setInterestedStudents(interestedStudents.filter(student => student.id !== id));
  };

  // Current date for calendar
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  // Generate calendar days
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    
    let days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === currentDate.getDate();
      days.push(
        <div 
          key={`day-${i}`} 
          className={`h-8 w-8 flex items-center justify-center rounded-full ${
            isToday ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6 bg-gray-50">
      {/* Main Dashboard Content (2/3 width) */}
      <div className="col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Faculty Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Welcome, Dr. Johnson</span>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              DJ
            </div>
          </div>
        </div>

        {/* Overview Section - Reordered and beautified */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Active Works</h3>
              <div className="p-2 rounded-lg bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">{activeProjects.length}</p>
            <p className="text-xs text-blue-600 font-medium mt-2">Currently in progress</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Projects Completed</h3>
              <div className="p-2 rounded-lg bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">{overviewData.projectsCompleted}</p>
            <p className="text-xs text-green-600 font-medium mt-2">This semester</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Student Responses</h3>
              <div className="p-2 rounded-lg bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">{overviewData.studentResponses}</p>
            <p className="text-xs text-purple-600 font-medium mt-2">+3 new this week</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Teams Under Guidance</h3>
              <div className="p-2 rounded-lg bg-yellow-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
            <p className="text-xs text-yellow-600 font-medium mt-2">Teams active</p>
          </div>
        </div>

        {/* Faculty Insights */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Faculty Insights</h2>
            <div className="flex space-x-2">
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white">
                <option>This Semester</option>
                <option>Last Semester</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Project Completion Trends */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Project Completion Trends</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={projectTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="semester" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(224, 231, 255, 0.2)'}} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Student Performance Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Student Performance Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={studentPerformanceData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {studentPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Faculty Workload Analysis */}
            <div className="col-span-2 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Faculty Workload Analysis</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={workloadData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(224, 231, 255, 0.2)'}} />
                  <Legend />
                  <Bar dataKey="assigned" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Active Works Section - Beautified */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Active Works</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors duration-200">
              View All
            </button>
          </div>
          
          <div className="space-y-6">
            {activeProjects.map(project => (
              <div key={project.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.team}</p>
                  </div>
                  <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    Due: {project.dueDate}
                  </span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      project.progress > 75 ? 'bg-green-500' : 
                      project.progress > 50 ? 'bg-blue-500' : 
                      project.progress > 25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                    aria-valuenow={project.progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Interested Table - Beautified */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Students Interested in Faculty Projects</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors duration-200">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {interestedStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(student.appliedOn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleAcceptStudent(student.id)}
                        className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium mr-2 hover:bg-green-100 transition-colors duration-200"
                        aria-label={`Accept ${student.name}`}
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRejectStudent(student.id)}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-100 transition-colors duration-200"
                        aria-label={`Reject ${student.name}`}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Panel (1/3 width) - Beautified */}
      <div className="col-span-1 space-y-6">
        {/* Calendar - Beautified */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{currentMonth} {currentYear}</h2>
            <div className="flex space-x-2">
              <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-xs font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 place-items-center">
            {generateCalendarDays()}
          </div>
        </div>

        {/* Activity Summary - Beautified */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Activity Summary</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors duration-200">
              View All
            </button>
          </div>
          
          <div className="space-y-5">
            {activities.map(activity => (
              <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                <p className="text-sm text-gray-700">{activity.message}</p>
                <div className="flex justify-between mt-2">
                  <button className="text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors duration-200">
                    {activity.action}
                  </button>
                  <span className="text-gray-500 text-xs bg-white px-2 py-1 rounded-full">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines - New Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Deadlines</h2>
          
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Team Beta Project Review</p>
                <p className="text-xs text-red-600">Due tomorrow</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">AI Healthcare System Milestone</p>
                <p className="text-xs text-yellow-600">Due in 3 days</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Research Paper Submission</p>
                <p className="text-xs text-green-600">Due in 7 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;