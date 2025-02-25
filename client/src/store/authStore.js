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
                    const response = await apiClient.post(endpoint, credentials);
                    
                    if (response.data.success) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            error: null
                        });

                        apiClient.defaults.headers.common['Authorization'] = 
                            `Bearer ${response.data.token}`;

                        return { success: true };
                    }
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isAuthenticated: false,
                        user: null
                    });
                    return { 
                        success: false, 
                        error: error.response?.data?.message || 'Login failed' 
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