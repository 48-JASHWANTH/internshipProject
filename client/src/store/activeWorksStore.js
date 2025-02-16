import { create } from 'zustand';

const useActiveWorksStore = create((set) => ({
  activeWorks: [
    {
      id: '1',
      title: 'E-Learning Platform',
      category: 'Major',
      Abstract: 'Traditional attendance systems are prone to inefficiencies, such as manual errors and proxy attendance. This project introduces a Smart Attendance System that automates the process using facial recognition and RFID technology. The system captures students attendance in real time using computer vision algorithms and securely stores the data in a cloud-based database. Faculty can monitor attendance reports, generate insights, and send notifications to absentees. The system eliminates manual interventions, improves accuracy, and ensures a seamless, contactless attendance process. This project is developed using Python, OpenCV, and a cloud-integrated backend, making it efficient and scalable for educational institutions',
      facultyGuide: 'Dr. Sarah Johnson',
      facultyEmail: 'sarah.johnson@university.edu',
      progress: 65,
      status: 'In Progress',
      startDate: '2024-01-15',  
      teamMembers: [
        { id: '1', name: 'John Doe', role: 'Frontend Developer' },
        { id: '2', name: 'Jane Smith', role: 'Backend Developer' },
        { id: '3', name: 'Mike Johnson', role: 'UI/UX Designer' },
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
      title: 'Smart Attendance System',
      category: 'CBP',
      Abstract: ' Traditional attendance systems are prone to inefficiencies, such as manual errors and proxy attendance. This project introduces a Smart Attendance System that automates the process using facial recognition and RFID technology. The system captures students attendance in real time using computer vision algorithms and securely stores the data in a cloud-based database. Faculty can monitor attendance reports, generate insights, and send notifications to absentees. The system eliminates manual interventions, improves accuracy, and ensures a seamless, contactless attendance process. This project is developed using Python, OpenCV, and a cloud-integrated backend, making it efficient and scalable for educational institutions ',
      facultyGuide: 'Prof. Michael Chen',
      facultyEmail: 'michael.chen@university.edu',
      progress: 40,
      status: 'Ongoing',
      startDate: '2024-02-01',
      teamMembers: [
        { id: '4', name: 'Alice Brown', role: 'ML Engineer' },
        { id: '5', name: 'Bob Wilson', role: 'System Architect' },
        { id: '6', name: 'Charlie Davis', role: 'UI/UX Designer' },
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
      title: 'IoT Weather Station',
      category: 'Mini',
      Abstract: 'Accurate and real-time weather monitoring is essential for various applications, including agriculture, disaster management, and smart cities. This project focuses on developing an IoT-based Weather Station that collects environmental data such as temperature, humidity, air quality, and atmospheric pressure using IoT sensors. The collected data is transmitted to a cloud-based dashboard, where users can visualize trends and receive alerts for extreme conditions. The system leverages Arduino/Raspberry Pi, MQTT protocols, and cloud integration to ensure real-time data transmission and analysis. This cost-effective and scalable solution can be deployed in urban and rural areas for enhanced weather monitoring and prediction.',
      facultyGuide: 'Dr. Emily White',
      facultyEmail: 'emily.white@university.edu',
      progress: 85,
      status: 'Near Completion',
      startDate: '2024-01-10',
      teamMembers: [
        { id: '7', name: 'Charlie Davis', role: 'Hardware Engineer' },
        { id: '8', name: 'Diana Miller', role: 'Software Engineer' },
        { id: '9', name: 'Ethan Johnson', role: 'UI/UX Designer' },
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
}));

export default useActiveWorksStore; 