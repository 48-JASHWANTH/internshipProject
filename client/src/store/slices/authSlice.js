import { apiClient } from '@/lib/api-client';

const createAuthSlice = (set, get) => ({
    user: null,
    isAuthenticated: false,
    error: null,

    login: async (credentials, userType) => {
        try {
            const endpoint = `/${userType.toLowerCase()}/login`;
            console.log("Login attempt:", { endpoint, credentials });
            
            const response = await apiClient.post(endpoint, credentials,{withCredentials:true});
            console.log("Login response:", response.data);
            
            if (response.data.success) {
                set({
                    user: response.data.user || { 
                        role: userType.toLowerCase(),
                        ...credentials
                    }, 
                    isAuthenticated: true,
                    error: null
                });

                apiClient.defaults.headers.common['Authorization'] = 
                    `Bearer ${response.data.token}`;

                return { success: true };
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login error:", error);
            set({
                error: error.response?.data?.message || error.message || 'Login failed',
                isAuthenticated: false,
                user: null
            });
            return { 
                success: false, 
                error: error.response?.data?.message || error.message || 'Login failed',
                message: error.response?.data?.message,
                attemptsRemaining: error.response?.data?.attemptsRemaining,
                status: error.response?.status
            };
        }
    },

    logout: () => {
        // Clear auth state
        set({
            user: null,
            isAuthenticated: false,
            error: null
        });
        
        // Clear data
        if (get().clearStudentData) {
            get().clearStudentData();
        }

        if (get().clearLeadedProjects) {
            get().clearLeadedProjects();
        }

        if (get().clearProfileData) {
            get().clearProfileData();
        }
        
        // Clear active works data
        if (get().clearActiveWorks) {
            get().clearActiveWorks();
        }

        if(get().clearArchiveProjects){
            get().clearArchiveProjects();
        }
        
        // Clear auth header
        delete apiClient.defaults.headers.common['Authorization'];
        
        // Clear any stored data
        localStorage.removeItem('app-storage');
        
        // Redirect to root URL (login page)
        window.location.href = '/';
    },

    clearError: () => set({ error: null })
});

export default createAuthSlice; 