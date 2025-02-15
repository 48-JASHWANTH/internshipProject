import { create } from 'zustand';

const useTaskStore = create((set) => ({
  tasks: [
    {
      id: 1,
      title: "LinkedIn Performance Marketing",
      description: "Create and optimize LinkedIn ad campaigns for Q2",
      deadline: "2024-05-31",
      assignedFaculty: "Prof. Smith",
      status: "To-Do",
      area: "Performance Marketing"
    },
    {
      id: 2,
      title: "Facebook Campaign",
      description: "Design and launch Facebook marketing campaign",
      deadline: "2024-05-31",
      assignedFaculty: "Prof. Johnson",
      status: "In Progress",
      area: "Product Marketing"
    },
    {
      id: 3,
      title: "Partner Session",
      description: "Organize partner collaboration session",
      deadline: "2024-05-25",
      assignedFaculty: "Prof. Williams",
      status: "To-Do",
      area: "Event Management"
    },
    {
      id: 4,
      title: "Instagram Campaign",
      description: "Create content strategy for Instagram",
      deadline: "2024-05-23",
      assignedFaculty: "Prof. Davis",
      status: "Done",
      area: "Product Marketing"
    },
    {
      id: 5,
      title: "Website Campaign",
      description: "Update website content and SEO optimization",
      deadline: "2024-05-26",
      assignedFaculty: "Prof. Brown",
      status: "In Progress",
      area: "Product Marketing"
    },
    {
      id: 6,
      title: "Email Marketing Campaign",
      description: "Design email templates and setup automation",
      deadline: "2024-06-15",
      assignedFaculty: "Prof. Wilson",
      status: "To-Do",
      area: "Performance Marketing"
    },
    {
      id: 7,
      title: "SEO Optimization",
      description: "Improve website SEO rankings",
      deadline: "2024-06-10",
      assignedFaculty: "Prof. Anderson",
      status: "To-Do",
      area: "Performance Marketing"
    },
    {
      id: 8,
      title: "Content Strategy",
      description: "Develop Q3 content calendar",
      deadline: "2024-06-05",
      assignedFaculty: "Prof. Taylor",
      status: "In Progress",
      area: "Product Marketing"
    }
  ],
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    )
  })),
  moveTaskForward: (taskId) => set((state) => ({
    tasks: state.tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = 
          task.status === 'To-Do' ? 'In Progress' :
          task.status === 'In Progress' ? 'Done' :
          task.status;
        return { ...task, status: newStatus };
      }
      return task;
    })
  })),
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== taskId)
  })),
  setTasks: (tasks) => set({ tasks }),
}));

export default useTaskStore; 