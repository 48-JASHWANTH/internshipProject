
    // const activeWorks: [
    //     {
    //         id: 1,
    //         title: "E-Learning Platform",
    //         description: "Building a comprehensive learning management system",
    //         team: ["John Doe", "Jane Smith"],
    //         deadline: "2024-05-01",
    //         category: "Major",
    //         status: "In Progress"
    //     },
    //     {
    //         id: 2,
    //         title: "Library Management System",
    //         description: "Digital system for library resource management",
    //         team: ["Alice Brown"],
    //         deadline: "2024-03-15",
    //         category: "Mini",
    //         status: "Review"
    //     }
    // ]


const createProjectSlice = (set) => ({
    projects: [
        {
            id: '1',
            title: 'AI-Powered Healthcare Diagnostic System',
            category: 'Major',
            status: 'active',
            Abstract: 'An advanced healthcare diagnostic system leveraging artificial intelligence...',
            facultyGuide: 'Dr. Sarah Johnson',
            facultyEmail: 'sarah.johnson@university.edu',
            progress: 75,
            startDate: '2024-01-15',
            studentName: 'Alex Kumar',
            reviews: [
                {
                    id: 'r1',
                    title: 'Initial Project Review',
                    date: '2024-01-20',
                    status: 'Completed',
                    feedback: 'Initial review completed. Project scope and objectives are well defined.',
                    score: 8
                },
                {
                    id: 'r2',
                    title: 'Mid-term Evaluation',
                    date: '2024-02-05',
                    status: 'Pending',
                    feedback: '',
                    score: 0
                }
            ],
            teamMembers: [
                { id: '1', name: 'Alex Kumar', role: 'ML Engineer' },
                { id: '2', name: 'Priya Sharma', role: 'Backend Developer' },
            ],
            tasks: [
                {
                    id: 't1',
                    title: 'Research Phase',
                    description: 'Conduct initial research and gather requirements',
                    deadline: '2024-03-25',
                    assignedFaculty: 'Dr. Sarah Johnson',
                    status: 'To-Do',
                    area: 'Research'
                },
                {
                    id: 't2',
                    title: 'Frontend Development',
                    description: 'Implement main dashboard components',
                    deadline: '2024-04-01',
                    assignedFaculty: 'Dr. Sarah Johnson',
                    status: 'In Progress',
                    area: 'Development'
                }
            ],
            resources: {
                abstractPdf: null,
                githubUrl: null,
                documents: []
            }
        }
    ],
    activeWorks: undefined,
    setActiveWorks: (activeWorks) => set({ activeWorks }),
    
    // Actions
    addProject: (project) => 
        set((state) => ({
            projects: [...state.projects, project]
        })),

    updateProject: (projectId, updates) =>
        set((state) => ({
            projects: state.projects.map(project =>
                project.id === projectId ? { ...project, ...updates } : project
            )
        })),

    updateProjectStatus: (projectId, status) =>
        set((state) => ({
            projects: state.projects.map(project =>
                project.id === projectId ? { ...project, status } : project
            )
        })),

    updateProjectResource: (projectId, resourceType, value) =>
        set((state) => ({
            projects: state.projects.map(project =>
                project.id === projectId
                    ? {
                        ...project,
                        resources: {
                            ...project.resources,
                            [resourceType]: value
                        }
                    }
                    : project
            )
        })),
    
    
    
    
});

export default createProjectSlice; 