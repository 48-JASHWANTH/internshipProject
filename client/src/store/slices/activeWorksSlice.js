import { apiClient } from "@/lib/api-client";

const createActiveWorksSlice = (set, get) => ({
  activeWorks: null,
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),

  fetchActiveWorks: async (studentID, forceRefresh = false) => {
    // Don't fetch if data exists and no force refresh
    if (!forceRefresh && get().activeWorks?.activeProjects) {
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const response = await apiClient.get(`/student/activeWorks/${studentID}`, {
        withCredentials: true
      });

      if (response.data.success) {
        set({ 
          activeWorks: response.data,
          loading: false 
        });
      }
    } catch (err) {
      console.error('Error fetching active works:', err);
      set({ error: 'Failed to load active works.', loading: false });
    }
  },

  clearActiveWorks: () => {
    set({ activeWorks: null, loading: false, error: null });
  }
});

export default createActiveWorksSlice; 