import { create } from 'zustand';

const useProjectForumStore = create((set) => ({
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
  
  expressInterest: (projectId) => set((state) => ({
    forumProjects: state.forumProjects.map(project => 
      project.id === projectId 
        ? { ...project, interested: true }
        : project
    )
  })),

  addForumProject: (project) => set((state) => ({
    forumProjects: [...state.forumProjects, project]
  })),
}));

export default useProjectForumStore; 