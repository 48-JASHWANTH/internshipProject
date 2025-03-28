import { apiClient } from "@/lib/api-client";

const createStudentSlice = (set, get) => ({
    studentData: null,
    loading: false,
    setLoading: (loading) => set({ loading }),
    error: null,
    
    fetchStudentData: async (studentID) => {
      // Clear existing data first
      set({ studentData: null, loading: true, error: null });
      
      try {
        const response = await apiClient.get(`student/data/${studentID}`, { withCredentials: true });
        set({ studentData: response.data, loading: false });
      } catch (err) {
        console.error('Error fetching student data:', err);
        set({ error: 'Failed to load student data.', loading: false });
      }
    },

    // Add a clear function to reset the state
    clearStudentData: () => {
      set({ studentData: null, loading: false, error: null });
    }
});
  
export default createStudentSlice;
  