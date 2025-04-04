import { apiClient } from '@/lib/api-client';

const createLeadedWorksSlice = (set, get) => ({
  activeProjects: null,
  isLoading: false,
  error: null,

  // Fetch leaded projects for a faculty
  fetchLeadedProjects: async (facultyID) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiClient.get(`/faculty/${facultyID}/leaded-projects`, {
        withCredentials: true
      });
      console.log(response.data);
      if (response.data.success) {
        set({ 
          activeProjects: response.data || [],
          isLoading: false 
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || 'Failed to fetch leaded projects');
      }
    } catch (error) {
      console.error('Error fetching leaded projects:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Error fetching leaded projects',
        isLoading: false 
      });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error fetching leaded projects' 
      };
    }
  },

  // Get details for a specific leaded project
  getLeadedProjectDetails: (projectId) => {
    const { activeProjects } = get();
    return activeProjects.find(project => project.classID === projectId) || null;
  },

  // Clear leaded projects data
  clearLeadedProjects: () => {
    set({ 
      activeProjects: null, 
      isLoading: false,
      error: null 
    });
  },
  
});

export default createLeadedWorksSlice; 