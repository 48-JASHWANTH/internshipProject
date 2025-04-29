import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Calendar, User, ArrowLeft, ChevronRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
// import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const InchargeClassTeams = () => {
  const navigate = useNavigate();
  const { classSection } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Get data from the store
  const { activeProjects, user, fetchLeadedProjects } = useStore();
  
  // Find the section team and its teams
  const sectionTeam = useMemo(() => {
    if (!activeProjects?.sectionTeams) return null;
    return activeProjects.sectionTeams.find(section => section.classID === classSection);
  }, [activeProjects, classSection]);
  
  // Get teams for this section
  const teamsData = useMemo(() => {
    if (!activeProjects?.teams || !sectionTeam) return [];
    
    // Filter teams that belong to this section
    const sectionTeams = activeProjects.teams.filter(team => 
      team.teamId.startsWith(classSection)
    );

    
    // Map to the format needed for display
    return sectionTeams.map(team => {
      // Extract team number from teamId (e.g., "1742886507270_1" -> "01")
      const teamNo = team.teamId.split('_')[1].padStart(2, '0');
      //console.log(team.tasks);
      // Calculate progress based on tasks and reviews
      const totalTasks = team.tasks?.length || 0;
      // console.log(team.tasks);
      const completedTasks = team.tasks?.filter(task => 
        task.status === 'done' || task.status === 'approved'
      ).length || 0;
      
      
      // Calculate progress percentage
      const progress = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;
      
      return {
        id: team.teamId,
        teamNo,
        teamName: `Team ${teamNo}`,
        projectTitle: team.projectTitle || sectionTeam.projectTitles[team.teamId] || 'Untitled Project',
        category: sectionTeam.projectType,
        status: team.status ? 'Completed' : 'In Progress',
        startDate: team.createdAt,
        teamSize: team.listOfStudents?.length || 0,
        guide: team.guideFacultyId || 'Not Assigned',
        progress: progress, // Use the calculated progress
        section: sectionTeam.section
      };
    });
  }, [activeProjects, sectionTeam, classSection]);
  
  const filteredTeams = useMemo(() => {
    return teamsData.filter(team => 
      team.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teamsData, searchQuery]);

  const handleTeamClick = (teamId) => {
    navigate(`/Faculty/ActiveWorks/Incharge/${classSection}/${teamId}`);
  };
  
  // Format date or provide a default
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  // Handle complete submission
  const handleCompleteSubmission = async () => {
    if (!user?.facultyID) {
      toast.error("Faculty ID not found");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.put(
        `faculty/complete-class/${classSection}`,
        {
          facultyID: user.facultyID,
          completionDate: new Date().toISOString().split('T')[0]
        },
        {
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        toast.success("Class marked as completed successfully!");
        // Refresh the data
        await fetchLeadedProjects(user.facultyID);
        // Navigate back to active works
        navigate('/Faculty/ActiveWorks/Incharge');
      } else {
        toast.error(response.data.message || "Failed to complete submission");
      }
    } catch (error) {
      console.error("Error completing submission:", error);
      toast.error(error.response?.data?.message || "An error occurred while completing submission");
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (teamsData.length === 0) return 0;
    const totalProgress = teamsData.reduce((sum, team) => sum + team.progress, 0);
    return Math.round(totalProgress / teamsData.length);
  }, [teamsData]);

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/Faculty/ActiveWorks/Incharge')}
            className="hover:text-[#9b1a31] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <ChevronRight className="w-4 h-4" />
          {/* <span className="text-gray-900 font-medium">{classSection}</span> */}
        </nav>

        {/* Centered Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {sectionTeam ? `${sectionTeam.branch} - Section ${sectionTeam.section}` : classSection} Teams
          </h1>
          {sectionTeam && (
            <p className="text-gray-600 mt-2">
              {sectionTeam.projectType} • {sectionTeam.numberOfTeams} Teams
            </p>
          )}
        </div>
        
        {/* Overall Progress and Complete Submission Button */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Progress</h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Class Completion</span>
              <span className="text-sm font-medium text-[#9b1a31]">{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-[#9b1a31] rounded-full h-2.5 transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#7d1527] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Submission
              </>
            )}
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by team name or project title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#9b1a31] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No teams found for this class section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <div 
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleTeamClick(team.id)}
              >
                <div className="p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {team.teamNo} - {team.projectTitle}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">
                        {team.category}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full">
                        {team.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>Team Size: {team.teamSize}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {formatDate(team.startDate)}</span>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-[#9b1a31]">{team.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#9b1a31] rounded-full h-2 transition-all duration-300"
                          style={{ width: `${team.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        Guide: {team.guide}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-[#9b1a31]" />
              <h3 className="text-xl font-semibold text-gray-900">Confirm Completion</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this class as completed? This action will move all teams to the archived projects section and cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSubmission}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#7d1527] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InchargeClassTeams; 