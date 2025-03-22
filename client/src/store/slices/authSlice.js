import { apiClient } from '@/lib/api-client';

const createAuthSlice = (set) => ({
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
                error: error.response?.data?.message || error.message || 'Login failed' 
            };
        }
    },

    logout: () => {
        set({
            user: null,
            isAuthenticated: false,
            error: null
        });
        delete apiClient.defaults.headers.common['Authorization'];
    },

    clearError: () => set({ error: null })
});

export default createAuthSlice; 