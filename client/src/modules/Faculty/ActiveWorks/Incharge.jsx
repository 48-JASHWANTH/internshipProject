import React from "react";

const Incharge = () => {
  const inchargeProjects = [
    {
      id: 1,
      title: "Smart City Planning",
      department: "Computer Science",
      teams: 4,
      students: 12,
      status: "On Track",
    },
    {
      id: 2,
      title: "Renewable Energy Solutions",
      department: "Electrical Engineering",
      teams: 3,
      students: 9,
      status: "Delayed",
    },
    {
      id: 3,
      title: "Healthcare Management System",
      department: "Information Technology",
      teams: 5,
      students: 15,
      status: "On Track",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Projects As Incharge</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="text-lg font-semibold">Total Projects</div>
          <div className="text-3xl font-bold mt-2 text-[#82001A]">{inchargeProjects.length}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="text-lg font-semibold">Total Teams</div>
          <div className="text-3xl font-bold mt-2 text-[#82001A]">
            {inchargeProjects.reduce((sum, project) => sum + project.teams, 0)}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="text-lg font-semibold">Total Students</div>
          <div className="text-3xl font-bold mt-2 text-[#82001A]">
            {inchargeProjects.reduce((sum, project) => sum + project.students, 0)}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold border-b">
          <div className="col-span-4">Project Title</div>
          <div className="col-span-3">Department</div>
          <div className="col-span-1">Teams</div>
          <div className="col-span-2">Students</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        {inchargeProjects.map((project) => (
          <div key={project.id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50">
            <div className="col-span-4 font-medium">{project.title}</div>
            <div className="col-span-3">{project.department}</div>
            <div className="col-span-1">{project.teams}</div>
            <div className="col-span-2">{project.students}</div>
            <div className="col-span-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.status === "On Track" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {project.status}
              </span>
            </div>
            <div className="col-span-1">
              <button className="text-blue-600 hover:text-blue-800">View</button>
            </div>
          </div>
        ))}
      </div>
      
      {inchargeProjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No projects found under your charge.
        </div>
      )}
    </div>
  );
};

export default Incharge; 