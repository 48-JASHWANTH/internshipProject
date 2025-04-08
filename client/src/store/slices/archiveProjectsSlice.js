import { apiClient } from '@/lib/api-client';

export const createArchiveProjectsSlice = (set, get) => ({
  // State
  archivedProjects: null,
  loading: false,
  error: null,
  
  // Actions
  fetchArchivedProjects: async (studentID, forceRefresh = false) => {
    try {
      // Check if we're already loading
      if (get().loading) return;

      // Check if we already have data and not forcing refresh
      if (get().archivedProjects && !forceRefresh) return;

      set({ loading: true, error: null });

      const response = await apiClient.get(`student/archive/${studentID}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        set({
          archivedProjects: response.data.completedProjects,
          loading: false,
          error: null
        });
      } else {
        set({
          loading: false,
          error: response.data.message || 'Failed to fetch archived projects'
        });
      }
    } catch (error) {
      console.error('Error fetching archived projects:', error);
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch archived projects'
      });
    }
  },

  // Reset state
  clearArchiveProjects: () => {
    set({
      archivedProjects: null,
      loading: false,
      error: null
    });
  },
})

export default createArchiveProjectsSlice;
