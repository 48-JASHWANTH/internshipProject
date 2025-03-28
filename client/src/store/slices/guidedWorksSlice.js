import { apiClient } from '@/lib/api-client';

const createGuidedWorksSlice = (set, get) => ({
  guidedProjects: null,
  isLoading: false,
  error: null,

  // Fetch guided projects for a faculty
  fetchGuidedProjects: async (facultyID) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.get(`/faculty/${facultyID}/guided-projects`, {
        withCredentials: true
      });

      console.log(response.data);
      
      if (response.data.success) {
        set({ 
          guidedProjects: response.data || [],
          isLoading: false 
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || 'Failed to fetch guided projects');
      }
    } catch (error) {
      console.error('Error fetching guided projects:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Error fetching guided projects',
        isLoading: false 
      });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error fetching guided projects' 
      };
    }
  },

  // Get details for a specific guided project
  getGuidedProjectDetails: (projectId) => {
    const { guidedProjects } = get();
    if (!guidedProjects?.teams) return null;
    return guidedProjects.teams.find(team => team.teamId === projectId) || null;
  },

  // Get all teams for a specific section
  getGuidedTeamsBySection: (sectionId) => {
    const { guidedProjects } = get();
    if (!guidedProjects?.teams) return [];
    return guidedProjects.teams.filter(team => team.teamId.startsWith(sectionId));
  },

  // Update a guided project task
  updateGuidedProjectTask: (teamId, taskId, updatedTask) => {
    const { guidedProjects } = get();
    if (!guidedProjects?.teams) return;

    const updatedTeams = guidedProjects.teams.map(team => {
      if (team.teamId === teamId) {
        const updatedTasks = team.tasks.map(task => 
          task._id === taskId ? { ...task, ...updatedTask } : task
        );
        return { ...team, tasks: updatedTasks };
      }
      return team;
    });

    set({
      guidedProjects: {
        ...guidedProjects,
        teams: updatedTeams
      }
    });
  },

  // Add a new task to a guided project
  addGuidedProjectTask: (teamId, newTask) => {
    const { guidedProjects } = get();
    if (!guidedProjects?.teams) return;

    const updatedTeams = guidedProjects.teams.map(team => {
      if (team.teamId === teamId) {
        return { 
          ...team, 
          tasks: [...team.tasks, newTask] 
        };
      }
      return team;
    });

    set({
      guidedProjects: {
        ...guidedProjects,
        teams: updatedTeams
      }
    });
  },

  // Add a new review to a guided project
  addGuidedProjectReview: (teamId, newReview) => {
    const { guidedProjects } = get();
    if (!guidedProjects?.teams) return;

    const updatedTeams = guidedProjects.teams.map(team => {
      if (team.teamId === teamId) {
        return { 
          ...team, 
          reviews: [...(team.reviews || []), newReview] 
        };
      }
      return team;
    });

    set({
      guidedProjects: {
        ...guidedProjects,
        teams: updatedTeams
      }
    });
  },

  // Clear guided projects data
  clearGuidedProjects: () => {
    set({ guidedProjects: null, error: null });
  }
});

export default createGuidedWorksSlice; 