const createFacultyProfileSlice = (set) => ({
    profileData: {
        empname: '',
        empcode: '',
        displayName: '',
        gender: '',
        email: '',
        contactNumber: '',
        dateOfBirth: '',
        jntuId: '',
        workLocation: '',
        department: '',
        designation: '',
        manager1: '',
        manager2: '',
        employmentType: '',
        teachType: '',
        shift: '',
        status: '',
        joiningDate: '',
        qualification: '',
        natureOfAssociation: '',
        alternateEmail: '',
        emergencyContact: '',
        profilePic: null,
        researchInterests: [],
        publications: [],
        courses: [],
        projects: [],
        socialLinks: {
            googleScholar: "https://scholar.google.com/citations?user=example",
            vidwan: "https://vidwan.inflibnet.ac.in/profile/example",
            linkedin: "https://linkedin.com/in/sriramchowdary"
        }
    },
    
    setProfileData: (data) => set({ profileData: data }),
    
    updateProfileData: (updatedData) => 
        set((state) => ({
            profileData: {
                ...state.profileData,
                ...updatedData
            }
        })),
    
    updateSocialLinks: (links) =>
        set((state) => ({
            profileData: {
                ...state.profileData,
                socialLinks: {
                    ...state.profileData.socialLinks,
                    ...links
                }
            }
        })),
    
    clearProfileData: () => 
        set({
            profileData: {
                empname: '',
                empcode: '',
                gender: '',
                email: '',
                contactNumber: '',
                dateOfBirth: '',
                jntuId: '',
                workLocation: '',
                department: '',
                designation: '',
                manager1: '',
                manager2: '',
                employmentType: '',
                teachType: '',
                shift: '',
                status: '',
                joiningDate: '',
                qualification: '',
                natureOfAssociation: '',
                alternateEmail: '',
                emergencyContact: '',
                profilePic: null,
                researchInterests: [],
                publications: [],
                courses: [],
                projects: [],
                socialLinks: {
                    googleScholar: "https://scholar.google.com/citations?user=example",
                    vidwan: "https://vidwan.inflibnet.ac.in/profile/example",
                    linkedin: "https://linkedin.com/in/sriramchowdary"
                }
            }
        }),
});

export default createFacultyProfileSlice; 