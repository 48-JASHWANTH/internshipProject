import { create } from 'zustand';

// Sample data for testing - replace with actual API calls later
const sampleData = {
  forumProjects: [
    {
      id: 1,
      title: "AI-Powered Student Assistant",
      description: "Develop an AI chatbot to help students with common queries",
      skills: ["React", "Python", "Machine Learning"],
      faculty: "Dr. Smith",
      category: "ai/ml",
      interested: false
    },
    {
      id: 2,
      title: "Smart Campus Navigation",
      description: "Mobile app for indoor navigation within campus buildings",
      skills: ["React Native", "Node.js", "IoT"],
      faculty: "Dr. Johnson",
      category: "mobile",
      interested: false
    }
  ],
  activeWorks: [
    {
      id: 1,
      title: "E-Learning Platform",
      description: "Building a comprehensive learning management system",
      team: ["John Doe", "Jane Smith"],
      deadline: "2024-05-01",
      category: "Major",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Library Management System",
      description: "Digital system for library resource management",
      team: ["Alice Brown"],
      deadline: "2024-03-15",
      category: "Mini",
      status: "Review"
    }
  ],
  completedProjects: [
    {
      id: 1,
      title: "Student Attendance System",
      description: "Automated attendance tracking using facial recognition",
      branch: "CSE",
      year: "2023",
      category: "ai/ml",
      team: ["Team A"]
    },
    {
      id: 2,
      title: "Campus Event Manager",
      description: "Web platform for managing college events",
      branch: "CSE",
      year: "2022",
      category: "web",
      team: ["Team B"]
    }
  ]
};

const useProjectStore = create((set) => ({
  forumProjects: sampleData.forumProjects,
  activeWorks: sampleData.activeWorks,
  completedProjects: sampleData.completedProjects,
  
  setForumProjects: (projects) => set({ forumProjects: projects }),
  setActiveWorks: (works) => set({ activeWorks: works }),
  setCompletedProjects: (projects) => set({ completedProjects: projects }),
  
  expressInterest: (projectId) => set((state) => ({
    forumProjects: state.forumProjects.map(project => 
      project.id === projectId 
        ? { ...project, interested: true }
        : project
    )
  })),
}));

export default useProjectStore; 