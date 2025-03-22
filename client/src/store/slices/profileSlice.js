import { apiClient } from "@/lib/api-client";

const createStudentSlice = (set, get) => ({
    studentData: null,
    loading: false,
    setLoading : (loading)=>set({loading}),
    error: null,
    
    fetchStudentData: async (studentID) => {
      if (get().studentData) return; // Prevent duplicate API calls
  
      set({ loading: true, error: null });
      try {
        const response = await apiClient.get(`student/data/${studentID}`, { withCredentials: true });
        set({ studentData: response.data, loading: false });
      } catch (err) {
        console.error('Error fetching student data:', err);
        set({ error: 'Failed to load student data.', loading: false });
      }
    },
  });
  
  export default createStudentSlice;
  