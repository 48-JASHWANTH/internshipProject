import axios from "axios";
import { HOST } from "@/utils/constants";

// Create the API client instance
export const apiClient = axios.create({
    baseURL: "https://edu-bridge-backend.onrender.com"
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    // For successful responses
    response => response,
    // For error responses
    error => {
        // Check if this is a notification-related endpoint
        const isNotificationEndpoint = error.config?.url?.includes('/api/notifications');
        
        // For notification endpoints, don't propagate 401 errors to prevent logout
        if (isNotificationEndpoint && error.response?.status === 401) {
            console.log('Intercepted auth error for notification endpoint:', error.config.url);
            // Return a resolved promise with a dummy response to prevent errors bubbling up
            return Promise.resolve({
                status: 204,
                data: { success: false, message: 'Authentication issue - silent fail' }
            });
        }
        
        // For all other errors, reject the promise normally
        return Promise.reject(error);
    }
);


