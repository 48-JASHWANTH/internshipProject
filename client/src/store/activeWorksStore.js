import { create } from 'zustand';

const createDummyReviews = (startDate, customFeedback = []) => {
  const reviews = [
    {
      id: `r${Math.random().toString(36).substr(2, 9)}`,
      title: 'Initial Project Review',
      date: startDate,
      status: 'Completed',
      feedback: customFeedback[0] || 'Initial review completed. Project scope and objectives are well defined.',
      score: Math.floor(Math.random() * 3) + 7,
      submittedAt: new Date(startDate).toISOString()
    },
    {
      id: `r${Math.random().toString(36).substr(2, 9)}`,
      title: 'Mid-term Evaluation',
      date: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 15)).toISOString().split('T')[0],
      status: 'Completed',
      feedback: customFeedback[1] || 'Good progress. Some improvements needed in documentation.',
      score: Math.floor(Math.random() * 3) + 7,
      submittedAt: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 15)).toISOString()
    },
    {
      id: `r${Math.random().toString(36).substr(2, 9)}`,
      title: 'Technical Implementation Review',
      date: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 30)).toISOString().split('T')[0],
      status: 'Pending',
      feedback: '',
      score: 0
    },
    {
      id: `r${Math.random().toString(36).substr(2, 9)}`,
      title: 'Final Project Evaluation',
      date: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 45)).toISOString().split('T')[0],
      status: 'Pending',
      feedback: '',
      score: 0
    }
  ];
  return reviews;
};

const useActiveWorksStore = create((set) => ({
  activeWorks: [
    {
      id: '1',
      title: 'AI-Powered Healthcare Diagnostic System',
      category: 'Major',
      Abstract: 'An advanced healthcare diagnostic system leveraging artificial intelligence and machine learning algorithms to assist medical professionals in early disease detection and diagnosis. The system analyzes medical imaging data, patient history, and symptoms to provide accurate diagnostic suggestions and risk assessments.',
      facultyGuide: 'Dr. Sarah Johnson',
      facultyEmail: 'sarah.johnson@university.edu',
      progress: 75,
      status: 'In Progress',
      startDate: '2024-01-15',
      reviews: createDummyReviews('2024-01-15', [
        'Excellent project concept. The AI algorithms show promising results in initial testing.',
        'Implementation is progressing well. Need to focus on improving the accuracy of diagnostic predictions.'
      ]),
      teamMembers: [
        { id: '1', name: 'Alex Kumar', role: 'ML Engineer' },
        { id: '2', name: 'Priya Sharma', role: 'Backend Developer' },
        { id: '3', name: 'James Wilson', role: 'Medical Data Analyst' },
        { id: '4', name: 'Sarah Chen', role: 'UI/UX Designer' }
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
    },
    {
      id: '2',
      title: 'Smart Agriculture Monitoring System',
      category: 'CBP',
      Abstract: 'IoT-based agriculture monitoring system that helps farmers optimize crop yield through real-time monitoring of soil conditions, weather patterns, and crop health. The system uses sensor networks and data analytics to provide actionable insights for irrigation and fertilization.',
      facultyGuide: 'Prof. Michael Chen',
      facultyEmail: 'michael.chen@university.edu',
      progress: 60,
      status: 'Ongoing',
      startDate: '2024-02-01',
      reviews: createDummyReviews('2024-02-01', [
        'Good integration of IoT sensors. Consider adding more weather prediction features.',
        'Mobile app interface is intuitive. Sensor calibration needs improvement.'
      ]),
      teamMembers: [
        { id: '5', name: 'Rahul Patel', role: 'IoT Specialist' },
        { id: '6', name: 'Emma Davis', role: 'Full Stack Developer' },
        { id: '7', name: 'Liu Wei', role: 'Data Scientist' }
      ],
      tasks: [
        {
          id: 't3',
          title: 'ML Model Training',
          description: 'Train the machine learning model',
          deadline: '2024-04-15',
          assignedFaculty: 'Alice Brown',
          status: 'To-Do',
          area: 'Machine Learning'
        },
        {
          id: 't4',
          title: 'System Architecture Design',
          description: 'Design the system architecture',
          deadline: '2024-03-30',
          assignedFaculty: 'Bob Wilson',
          status: 'In Progress',
          area: 'System Design'
        }
      ]
    },
    {
      id: '3',
      title: 'Blockchain-based Supply Chain Management',
      category: 'CBP',
      Abstract: 'A decentralized supply chain management system using blockchain technology to ensure transparency and traceability in product distribution. Features smart contracts for automated payments and real-time tracking of goods.',
      facultyGuide: 'Dr. Robert Taylor',
      facultyEmail: 'robert.taylor@university.edu',
      progress: 45,
      status: 'Ongoing',
      startDate: '2024-01-20',
      reviews: createDummyReviews('2024-01-20', [
        'Strong blockchain implementation. Need to simplify the user interface.',
        'Smart contracts are working effectively. Consider adding more security features.'
      ]),
      teamMembers: [
        { id: '8', name: 'David Kim', role: 'Blockchain Developer' },
        { id: '9', name: 'Maria Garcia', role: 'Smart Contract Specialist' },
        { id: '10', name: 'Tom Anderson', role: 'Frontend Developer' }
      ],
      tasks: [
        {
          id: 't5',
          title: 'Hardware Assembly',
          description: 'Assemble the hardware components',
          deadline: '2024-03-15',
          assignedFaculty: 'Charlie Davis',
          status: 'In Progress',
          area: 'Hardware'
        },
        {
          id: 't6',
          title: 'Software Integration',
          description: 'Integrate the software components',
          deadline: '2024-04-05',
          assignedFaculty: 'Diana Miller',
          status: 'To-Do',
          area: 'Software'
        }
      ]
    },
    {
      id: '4',
      title: 'Augmented Reality Campus Tour Guide',
      category: 'Mini',
      Abstract: 'An AR-based mobile application that provides interactive campus tours for new students and visitors. Users can point their phones at buildings to receive information, directions, and historical facts about campus locations.',
      facultyGuide: 'Dr. Emily White',
      facultyEmail: 'emily.white@university.edu',
      progress: 85,
      status: 'Near Completion',
      startDate: '2024-01-10',
      reviews: createDummyReviews('2024-01-10', [
        'Creative use of AR technology. App performance is excellent.',
        'User testing shows positive feedback. Add more historical content.'
      ]),
      teamMembers: [
        { id: '11', name: 'Sophie Brown', role: 'AR Developer' },
        { id: '12', name: 'Hassan Ahmed', role: 'Mobile Developer' },
        { id: '13', name: 'Lisa Chen', role: '3D Artist' }
      ],
      tasks: [
        {
          id: 't7',
          title: 'Research Phase',
          description: 'Conduct initial research and gather requirements',
          deadline: '2024-03-25',
          assignedFaculty: 'Dr. Sarah Johnson',
          status: 'To-Do',
          area: 'Research'
        },
        {
          id: 't8',
          title: 'Frontend Development',
          description: 'Implement main dashboard components',
          deadline: '2024-04-01',
          assignedFaculty: 'Dr. Sarah Johnson',
          status: 'In Progress',
          area: 'Development'
        }
      ]
    },
    {
      id: '5',
      title: 'Sustainable Urban Planning Analytics',
      category: 'Field',
      Abstract: 'A comprehensive urban planning tool that analyzes environmental impact, traffic patterns, and population density to propose sustainable city development solutions. Incorporates GIS data and machine learning for predictive modeling.',
      facultyGuide: 'Prof. Amanda Martinez',
      facultyEmail: 'amanda.martinez@university.edu',
      progress: 30,
      status: 'Initial Phase',
      startDate: '2024-02-15',
      reviews: createDummyReviews('2024-02-15', [
        'Innovative approach to urban planning. Expand the GIS database.',
        'Good progress on analytics engine. Need more real-world data testing.'
      ]),
      teamMembers: [
        { id: '14', name: 'Ryan O\'Connor', role: 'GIS Specialist' },
        { id: '15', name: 'Aisha Patel', role: 'Urban Planning Analyst' },
        { id: '16', name: 'Marcus Johnson', role: 'Data Engineer' },
        { id: '17', name: 'Nina Rodriguez', role: 'Sustainability Expert' }
      ],
      tasks: [
        {
          id: 't9',
          title: 'Research Phase',
          description: 'Conduct initial research and gather requirements',
          deadline: '2024-03-25',
          assignedFaculty: 'Dr. Sarah Johnson',
          status: 'To-Do',
          area: 'Research'
        },
        {
          id: 't10',
          title: 'Frontend Development',
          description: 'Implement main dashboard components',
          deadline: '2024-04-01',
          assignedFaculty: 'Dr. Sarah Johnson',
          status: 'In Progress',
          area: 'Development'
        }
      ]
    }
  ],

  // Actions
  addProject: (project) => 
    set((state) => ({
      activeWorks: [...state.activeWorks, project]
    })),

  updateProject: (projectId, updates) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(project =>
        project.id === projectId ? { ...project, ...updates } : project
      )
    })),

  updateProjectTasks: (projectId, tasks) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(project =>
        project.id === projectId 
          ? { ...project, tasks: tasks }
          : project
      )
    })),

  moveTask: (projectId, taskId, newStatus) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(project => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          );
          return { ...project, tasks: updatedTasks };
        }
        return project;
      })
    })),

  deleteProject: (projectId) =>
    set((state) => ({
      activeWorks: state.activeWorks.filter(project => project.id !== projectId)
    })),

  updateProjectProgress: (projectId, progress) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(project =>
        project.id === projectId ? { ...project, progress } : project
      )
    })),

  // New actions for resources
  updateProjectResource: (projectId, resourceType, resourceData) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(project =>
        project.id === projectId
          ? {
              ...project,
              resources: {
                ...project.resources,
                [resourceType]: resourceData
              }
            }
          : project
      )
    })),

  addProjectDocument: (projectId, document) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(project =>
        project.id === projectId
          ? {
              ...project,
              resources: {
                ...project.resources,
                documents: [...(project.resources.documents || []), document]
              }
            }
          : project
      )
    })),

  removeProjectDocument: (projectId, documentId) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(project =>
        project.id === projectId
          ? {
              ...project,
              resources: {
                ...project.resources,
                documents: project.resources.documents.filter(doc => doc.id !== documentId)
              }
            }
          : project
      )
    })),

  // New methods for tasks
  updateProjectTask: (projectId, updatedTask) => 
    set((state) => ({
      activeWorks: state.activeWorks.map(work => 
        work.id === projectId 
          ? {
              ...work,
              tasks: work.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
              )
            }
          : work
      )
    })),

  moveProjectTaskForward: (projectId, taskId) =>
    set((state) => {
      const project = state.activeWorks.find(work => work.id === projectId);
      const task = project?.tasks.find(t => t.id === taskId);
      
      if (task && task.status === 'In Progress') {
        console.log('The Assigned task is completed:', {
          projectTitle: project.title,
          taskTitle: task.title,
          assignedby: task.assignedFaculty,
          deadline: task.deadline,
          area: task.area,
          description: task.description
        });
      }

      return {
        activeWorks: state.activeWorks.map(work => 
          work.id === projectId
            ? {
                ...work,
                tasks: work.tasks.map(task => {
                  if (task.id === taskId) {
                    const newStatus = 
                      task.status === 'To-Do' ? 'In Progress' :
                      task.status === 'In Progress' ? 'Done' :
                      task.status;
                    return { ...task, status: newStatus };
                  }
                  return task;
                })
              }
            : work
        )
      };
    }),

  addProjectTask: (projectId, task) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(work =>
        work.id === projectId
          ? { ...work, tasks: [...work.tasks, task] }
          : work
      )
    })),

  deleteProjectTask: (projectId, taskId) =>
    set((state) => ({
      activeWorks: state.activeWorks.map(work =>
        work.id === projectId
          ? { ...work, tasks: work.tasks.filter(task => task.id !== taskId) }
          : work
      )
    })),

  updateProjectReview: (projectId, reviewId, updatedReview) =>
    set((state) => ({
      activeWorks: state.activeWorks.map((work) =>
        work.id === projectId
          ? {
              ...work,
              reviews: work.reviews.map((review) =>
                review.id === reviewId ? updatedReview : review
              ),
            }
          : work
      ),
    })),
}));

export default useActiveWorksStore; 