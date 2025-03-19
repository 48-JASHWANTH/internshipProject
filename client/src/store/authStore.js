import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            error: null,

            login: async (credentials, userType) => {
                try {
                    // Convert userType to lowercase for API endpoint
                    const endpoint = `/${userType.toLowerCase()}/login`;
                    console.log("Login attempt:", { endpoint, credentials });
                    
                    const response = await apiClient.post(endpoint, credentials);
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
                // Clear auth state
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null
                });

                // Remove token from headers
                delete apiClient.defaults.headers.common['Authorization'];
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useAuthStore; 