import { create } from 'zustand';

const useArchivedProjectStore = create((set) => ({
  archivedProjects: [
    {
      id: 1,
      title: "E-Learning Platform",
      type: "Major",
      completionDate: "2023-12-15",
      teamMembers: ["John Doe", "Jane Smith", "Mike Johnson"],
      facultyGuide: "Dr. Sarah Wilson",
      description: "A comprehensive e-learning platform with video conferencing and assessment tools.",
      technologies: ["React", "Node.js", "MongoDB", "WebRTC"],
      githubLink: "https://github.com/project/e-learning",
      documents: [
        { name: "Final Report", url: "/documents/report.pdf" },
        { name: "Documentation", url: "/documents/docs.pdf" }
      ],
      branch: "CSE",
      year: "2023",
      category: "web"
    },
    // Add more sample projects...
  ],
  
  setArchivedProjects: (projects) => set({ archivedProjects: projects }),
}));

export default useArchivedProjectStore; 