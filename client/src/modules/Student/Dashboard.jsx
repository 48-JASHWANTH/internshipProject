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
      label: 'Tasks',
      data: [1, 2, 1.5, 2, 1, 2, 1.5],
      borderColor: '#82001A',
      tension: 0.4,
      pointRadius: 4,
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
        beginAtZero: true,
        max: 3,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const taskDetails = {
    title: "Creating Awesome Mobile Apps",
    role: "UI/UX Designer",
    progress: 90,
    duration: "1 Hour",
    team: [
      "/avatar1.jpg",
      "/avatar2.jpg",
      "/avatar3.jpg",
      "/avatar4.jpg",
      "/avatar5.jpg"
    ],
    tasks: [
      "Understanding the tools in Figma",
      "Understand the basics of making designs",
      "Design a mobile application with figma"
    ]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Student!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your internship journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<FaBriefcase className="text-blue-500" />}
          title="Active Applications"
          value="5"
          bgColor="bg-blue-50"
        />
        <StatsCard
          icon={<FaCalendar className="text-green-500" />}
          title="Upcoming Interviews"
          value="2"
          bgColor="bg-green-50"
        />
        <StatsCard
          icon={<FaClipboardList className="text-purple-500" />}
          title="Tasks Due"
          value="3"
          bgColor="bg-purple-50"
        />
        <StatsCard
          icon={<FaBell className="text-yellow-500" />}
          title="New Notifications"
          value="4"
          bgColor="bg-yellow-50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
            <div className="space-y-4">
              {/* Application Items */}
              <ApplicationItem
                company="Tech Corp"
                position="Frontend Developer Intern"
                status="Under Review"
                date="2024-03-15"
              />
              <ApplicationItem
                company="Innovation Labs"
                position="Software Engineer Intern"
                status="Interview Scheduled"
                date="2024-03-12"
              />
              <ApplicationItem
                company="Digital Solutions"
                position="Full Stack Developer Intern"
                status="Applied"
                date="2024-03-10"
              />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Calendar</h2>
            <div className="calendar-wrapper">
              <Calendar
                onChange={setDate}
                value={date}
                className="mx-auto w-full"
                tileClassName={({ date, view }) => {
                  // Add custom classes for dates with events
                  if (view === 'month') {
                    // Example: highlight dates with events (20th and 22nd March 2024)
                    if (
                      date.getDate() === 20 && 
                      date.getMonth() === 2 && 
                      date.getFullYear() === 2024
                    ) {
                      return 'bg-blue-100 rounded-lg';
                    }
                    if (
                      date.getDate() === 22 && 
                      date.getMonth() === 2 && 
                      date.getFullYear() === 2024
                    ) {
                      return 'bg-blue-100 rounded-lg';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              <EventItem
                title="Technical Interview"
                company="Tech Corp"
                datetime="2024-03-20 10:00 AM"
              />
              <EventItem
                title="HR Round"
                company="Innovation Labs"
                datetime="2024-03-22 2:30 PM"
              />
            </div>
          </div>

          {/* Selected Date Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Events for {date.toDateString()}
            </h2>
            <div className="space-y-4">
              {date.getDate() === 20 && date.getMonth() === 2 && (
                <EventItem
                  title="Technical Interview"
                  company="Tech Corp"
                  datetime="2024-03-20 10:00 AM"
                />
              )}
              {date.getDate() === 22 && date.getMonth() === 2 && (
                <EventItem
                  title="HR Round"
                  company="Innovation Labs"
                  datetime="2024-03-22 2:30 PM"
                />
              )}
              {!(date.getDate() === 20 || date.getDate() === 22) && (
                <p className="text-gray-500">No events scheduled for this date.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Activity</h2>
            <select className="border rounded px-2 py-1">
              <option>This Week</option>
            </select>
          </div>
          <div className="h-[200px]">
            <Line data={activityData} options={chartOptions} />
          </div>
        </div>

        {/* Task Today Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Task Today</h2>
            <button className="text-gray-400">•••</button>
          </div>

          <div className="mb-6">
            <img 
              src="/mobile-apps.jpg" 
              alt="Task" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold text-lg">{taskDetails.title}</h3>
            <p className="text-gray-600">{taskDetails.role}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Progress</span>
              <span>{taskDetails.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${taskDetails.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="mr-2">🕒</span>
              <span>{taskDetails.duration}</span>
            </div>
            <div className="flex -space-x-2">
              {taskDetails.team.map((avatar, index) => (
                <img 
                  key={index}
                  src={avatar}
                  alt={`Team member ${index + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Detail Task</h3>
            <div className="space-y-3">
              {taskDetails.tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Go To Detail
          </button>
        </div>
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
