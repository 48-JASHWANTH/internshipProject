import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import createAuthSlice from './slices/authSlice';
import createProfileSlice from './slices/profileSlice';
import createProjectSlice from './slices/projectSlice';
import createFacultyProfileSlice from './slices/facultyProfileSlice';
import createProjectForumSlice from './slices/projectForumSlice';
import createLeadedWorksSlice from './slices/leadedWorksSlice';
import createGuidedWorksSlice from './slices/guidedWorksSlice';

export const useStore = create(
    persist(
        (set, get) => ({
            ...createAuthSlice(set, get),
            ...createProfileSlice(set, get),
            ...createProjectSlice(set, get),
            ...createFacultyProfileSlice(set, get),
            ...createProjectForumSlice(set, get),
            ...createLeadedWorksSlice(set, get),
            ...createGuidedWorksSlice(set, get),
        }),
        // {
        //     name: 'app-storage',
        //     partialize: (state) => ({
        //         // Specify which parts of the state should be persisted
        //         user: state.user,
        //         isAuthenticated: state.isAuthenticated,
        //         profileData: state.profileData,
        //         projects: state.projects,
        //         forumProjects: state.forumProjects,
        //     }),
        //     getStorage: () => localStorage,
        // }
    )
);

