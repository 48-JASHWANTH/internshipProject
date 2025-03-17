import React from "react";

const Guide = () => {
  const guidedProjects = [
    {
      id: 1,
      title: "AI-Based Attendance System",
      students: ["John Doe", "Jane Smith"],
      progress: 65,
      lastUpdate: "2 days ago",
      nextMilestone: "Implementation Phase",
    },
    {
      id: 2,
      title: "Smart Home Automation",
      students: ["Alex Johnson", "Emily Brown"],
      progress: 40,
      lastUpdate: "1 week ago",
      nextMilestone: "Design Review",
    },
    {
      id: 3,
      title: "Blockchain for Supply Chain",
      students: ["Michael Wilson", "Sarah Davis"],
      progress: 80,
      lastUpdate: "Yesterday",
      nextMilestone: "Testing Phase",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Projects Under Guidance</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold border-b">
          <div className="col-span-4">Project Title</div>
          <div className="col-span-3">Students</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-2">Last Update</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        {guidedProjects.map((project) => (
          <div key={project.id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50">
            <div className="col-span-4 font-medium">{project.title}</div>
            <div className="col-span-3">
              {project.students.map((student, index) => (
                <div key={index} className="text-sm">{student}</div>
              ))}
            </div>
            <div className="col-span-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#82001A] h-2.5 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
            </div>
            <div className="col-span-2 text-sm text-gray-600">{project.lastUpdate}</div>
            <div className="col-span-1">
              <button className="text-blue-600 hover:text-blue-800">View</button>
            </div>
          </div>
        ))}
      </div>
      
      {guidedProjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No projects found under your guidance.
        </div>
      )}
    </div>
  );
};

export default Guide; 