import React, { useState } from 'react';
import { FaBriefcase, FaCalendar, FaClipboardList, FaBell } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [date, setDate] = useState(new Date());

  // Activity chart data
  const activityData = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [{
      label: 'Activity',
      data: [1, 2, 1.5, 1, 1.8, 1.2, 1],
      borderColor: '#82001A',
      tension: 0.4,
      pointRadius: 4,
      fill: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        display: false,
        beginAtZero: true
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  const statsData = [
    { 
      label: 'Assigned Projects',
      value: '3',
      icon: '🔷',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Completed Projects',
      value: '12',
      icon: '✅',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Pending Reviews',
      value: '2',
      icon: '⭐',
      bgColor: 'bg-yellow-50'
    },
    { 
      label: 'Due Date',
      value: '4/15/2024',
      icon: '📅',
      bgColor: 'bg-purple-50'
    }
  ];

  const activeWorks = [
    {
      title: 'AI Research Project',
      sponsor: 'Sarah Chen',
      lastReview: 'March 4',
      lastReviewer: '2/25/2024',
      status: 'In Progress'
    },
    {
      title: 'Data Analysis System',
      sponsor: 'James Wilson',
      lastReview: 'March 4',
      lastReviewer: '2/25/2024',
      status: 'Under Review'
    },
    {
      title: 'AI Research Project',
      sponsor: 'Sarah Chen',
      lastReview: 'March 4',
      lastReviewer: '2/25/2024',
      status: 'In Progress'
    },
    {
      title: 'AI Research Project',
      sponsor: 'Sarah Chen',
      lastReview: 'March 4',
      lastReviewer: '2/25/2024',
      status: 'In Progress'
    },
    {
      title: 'AI Research Project',
      sponsor: 'Sarah Chen',
      lastReview: 'March 4',
      lastReviewer: '2/25/2024',
      status: 'In Progress'
    }
  ];

  const recentReviews = [
    {
      project: 'AI Research Project',
      date: '4/2/2024',
      reviewer: 'Dr. Sarah Chen',
      rating: '4.5',
      status: 'Approved'
    },
    {
      project: 'Data Analysis System',
      date: '4/2/2024',
      reviewer: 'Prof. James Wilson',
      rating: '',
      status: 'Needs Revision'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-[#82001A] text-2xl font-bold">Welcome, Alex Johnson</h1>
        <p className="text-gray-500 text-sm">Student ID: ST2124001</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xl font-bold">{stat.value}</span>
            </div>
            <div className="text-gray-600 text-sm mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Activity Chart Section - Placeholder */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Your existing activity chart code */}
      </div>

      {/* Project Progress and Active Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Progress */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-6">Project Progress</h2>
          <div className="relative w-48 h-48 mx-auto">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                className="stroke-current text-gray-200"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                className="stroke-current text-[#82001A]"
                strokeWidth="16"
                fill="none"
                strokeDasharray="553"
                strokeDashoffset="138"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-500">Active</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Works */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Active Works</h2>
          <div className="space-y-4">
            {activeWorks.map((work, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{work.title}</h3>
                    <p className="text-sm text-gray-600">{work.sponsor}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    work.status === 'In Progress' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-[#82001A] text-white'
                  }`}>
                    {work.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <p>Last Review: {work.lastReview}</p>
                  <p>Last Reviewer: {work.lastReviewer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Recent Reviews</h2>
          <button className="text-[#82001A] text-sm hover:underline">View all</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 text-sm">
              <th className="pb-3">Project</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Reviewer</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recentReviews.map((review, index) => (
              <tr key={index} className="border-t">
                <td className="py-3">{review.project}</td>
                <td className="py-3">{review.date}</td>
                <td className="py-3">{review.reviewer}</td>
                <td className="py-3">{review.rating}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    review.status === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper Components
function StatsCard({ icon, title, value, bgColor }) {
  return (
    <div className={`${bgColor} rounded-lg p-6 flex items-center space-x-4`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ApplicationItem({ company, position, status, date }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review': return 'text-yellow-600 bg-yellow-100';
      case 'Interview Scheduled': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="border-b pb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{company}</h3>
          <p className="text-gray-600">{position}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-2">Applied on: {date}</p>
    </div>
  );
}

function EventItem({ title, company, datetime }) {
  return (
    <div className="border-b pb-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{company}</p>
      <p className="text-sm text-gray-500 mt-1">{datetime}</p>
    </div>
  );
}

// Add these styles to your CSS
const styles = `
.calendar-wrapper .react-calendar {
  border: none;
  width: 100%;
  font-family: inherit;
}

.react-calendar__tile--active {
  background: #3b82f6 !important;
  color: white;
}

.react-calendar__tile--now {
  background: #dbeafe;
}

.react-calendar__tile:enabled:hover,
.react-calendar__tile:enabled:focus {
  background-color: #bfdbfe;
}

.react-calendar__tile {
  padding: 1em 0.5em;
}
`;

// Add this style tag to your component
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Dashboard;
