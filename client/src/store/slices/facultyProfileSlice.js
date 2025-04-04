import axios from 'axios';

const createFacultyProfileSlice = (set, get) => ({
    profileData: null,
    isLoading: false,
    error: null,
    
    fetchProfileData: async (facultyId) => {
        try {
            set({ isLoading: true, error: null });
            
            const response = await axios.get(
                `http://localhost:1544/faculty/${facultyId}`,
                { withCredentials: true }
            );
            
            if (response.data.success) {
                // Map API response to profile structure
                const faculty = response.data.faculty;
                console.log(faculty);
                const profileData = {
                    empname: faculty.name || '',
                    empcode: faculty.facultyID || '',
                    displayName: faculty.name || '',
                    gender: faculty.gender || '',
                    email: faculty.email || '',
                    contactNumber: faculty.phoneNumber || '',
                    dateOfBirth: faculty.dob || '',
                    jntuId: faculty.jntuhID || '',
                    workLocation: faculty.workLocation || '',
                    department: faculty.department || '',
                    designation: faculty.designation || '',
                    manager1: faculty.manager1 || '',
                    manager2: faculty.manager2 || '',
                    employmentType: faculty.employmentType || '',
                    teachType: faculty.teachType || '',
                    shift: faculty.shift || '',
                    status: faculty.status || '',
                    joiningDate: faculty.joiningDate || '',
                    qualification: faculty.qualification || '',
                    natureOfAssociation: faculty.natureOfAssociation || '',
                    alternateEmail: faculty.alternateEmail || '',
                    emergencyContact: faculty.emergencyContact || '',
                    profilePic: faculty.profilePic || null,
                    // researchInterests: faculty.researchInterests || [],
                    // publications: faculty.publications || [],
                    // courses: faculty.courses || [],
                    // projects: faculty.projects || [],
                    googleScholar: faculty.googleScholarID || '',
                    vidwan: faculty.vidwanID || '',
                    linkedin: faculty.linkedInURL || '',
                    // Additional data from API
                    forumProjectsIds: faculty.forumProjectsIds || [],
                    guidingProjectsIds: faculty.guidingProjectsIds || [],
                    inchargeClassSections: faculty.inchargeClassSections || []
                };
                
                set({ profileData, isLoading: false });
            } else {
                set({ 
                    error: response.data.message || 'Failed to fetch profile data', 
                    isLoading: false 
                });
            }
        } catch (error) {
            console.error('Error fetching faculty profile:', error);
            set({ 
                error: error.response?.data?.message || 'An error occurred while fetching profile data', 
                isLoading: false 
            });
        }
    },
    
    setProfileData: (data) => set({ profileData: data }),
    
    updateProfileData: (updatedData) => 
        set((state) => ({
            profileData: state.profileData ? {
                ...state.profileData,
                ...updatedData
            } : updatedData
        })),
    
    updateSocialLinks: (links) =>
        set((state) => ({
            profileData: state.profileData ? {
                ...state.profileData,
                socialLinks: {
                    ...state.profileData.socialLinks,
                    ...links
                }
            } : null
        })),
    
    clearProfileData: () => set({ profileData: null, error: null }),
});

export default createFacultyProfileSlice; 