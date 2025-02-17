import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProfileStore = create(
  persist(
    (set) => ({
      profileData: {
        name: '',
        regNumber: '',
        email: '',
        phone: '',
        gender: 'Male',
        dob: '',
        profilePic: '',
        role: 'student',
      },
      isEditing: false,
      setIsEditing: (isEditing) => set({ isEditing }),
      updateProfile: (data) =>
        set((state) => ({
          profileData: {
            ...state.profileData,
            ...data,
          },
        })),
      setProfilePicture: (imageUrl) =>
        set((state) => ({
          profileData: {
            ...state.profileData,
            profilePic: imageUrl,
          },
        })),
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({ profileData: state.profileData }),
    }
  )
);

export default useProfileStore; 