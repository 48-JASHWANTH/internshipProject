import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectFormInput from "./ProjectFormInput";
import ProjectFormConfirmation from "./ProjectFormConfirmation";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { CREATE_TEAMS_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";
import { toast } from "react-hot-toast";
import { useStore } from "@/store/useStore";
import { Loader2 } from "lucide-react";

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [phase, setPhase] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    branch: "",
    section: "",
    projectType: "",
    subject: "",
    teamDetails: null,
  });
  const [excelData, setExcelData] = useState([]);
  const [showGuideWarning, setShowGuideWarning] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

  const handleSubmitAttempt = () => {
    const teamsWithoutGuides = excelData.filter(
      (team) => !team.guide || team.guide === "Not Assigned"
    );

    if (teamsWithoutGuides.length > 0) {
      setShowGuideWarning(true);
    } else {
      setShowFinalConfirmation(true);
    }
  };

  const handleFinalSubmit = async() => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    const facultyID = user?.facultyID;
    
    if (!facultyID) {
      toast.error('Faculty ID not found. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    const classID = Date.now().toString();
    
    // Build teams, projectTitles and guides objects in one pass
    const { teams, projectTitles, guides } = excelData.reduce((acc, team, index) => {
      const teamId = `${classID}_${index + 1}`;
      acc.teams[teamId] = team.students.map(student => student.rollNo);
      acc.projectTitles[teamId] = team.projectTitle;
      acc.guides[teamId] = team.facultyId || null;
      return acc;
    }, { teams: {}, projectTitles: {}, guides: {} });
    
    // Count totals
    const noOfTeams = excelData.length;
    const noOfStudents = excelData.reduce((acc, team) => acc + team.students.length, 0);
    
    // Subject determination
    const subject = formData.projectType === "Course Based Project(CBP)" 
      ? formData.subject 
      : "Not Applicable";
    
    // Build the response structure directly
    const responseData = {
      message: 'New work has been created successfully',
      newSectionTeam: {
        classID,
        year: formData.year,
        sem: formData.semester,
        branch: formData.branch,
        section: formData.section,
        projectType: formData.projectType,
        facultyID,
        numberOfTeams: noOfTeams,
        teamsList: teams,
        projectTitles,
        numberOfStudents: noOfStudents,
        status: 'In Progress'
      },
      createdTeams: Object.keys(teams).map(teamId => ({
        teamId,
        listOfStudents: teams[teamId],
        projectTitle: projectTitles[teamId],
        projectType: formData.projectType,
        subject,
        githubURL: "",
        guideApproval: true,
        guideFacultyId: guides[teamId],
        inchargefacultyId: facultyID
      }))
    };

    try {
        const res = await apiClient.post(CREATE_TEAMS_ROUTE, responseData, { withCredentials: true });
      
        if (res.status === 201) {
          // Send notifications for each team
          await Promise.all(Object.keys(teams).map(async (teamId) => {
            const projectTitle = projectTitles[teamId];
            const studentIds = teams[teamId];
            const guideFacultyId = guides[teamId];
            
            // Create notification for this team
            try {
              await apiClient.post('/api/notifications/project', {
                projectTitle,
                studentIds,
                guideFacultyId,
                inchargeFacultyId: facultyID,
                projectType: formData.projectType
              }, { withCredentials: true });
            } catch (notificationError) {
              console.error('Error sending notifications:', notificationError);
            }
          }));
          
          toast.success("Projects created successfully!");
          navigate("/Faculty/ActiveWorks/Incharge");
        } else {
          toast.error("Failed to create teams. Please try again.");
        }
      } catch (error) {
        console.error(error.response?.data?.message || "Failed to create teams. Please try again.");
        toast.error("Failed to create teams. Please try again.");
      } finally {
        setIsSubmitting(false);
      };
    
    // Single console log with the final response only
    console.log("Final Response:", responseData);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {phase === 1 ? (
          <ProjectFormInput
            formData={formData}
            setFormData={setFormData}
            setExcelData={setExcelData}
            setPhase={setPhase}
          />
        ) : (
          <ProjectFormConfirmation
            formData={formData}
            setFormData={setFormData}
            excelData={excelData}
            setExcelData={setExcelData}
            setPhase={setPhase}
            handleSubmit={handleSubmitAttempt}
            isSubmitting={isSubmitting}
          />
        )}
      </form>

      {showGuideWarning && (
        <ConfirmationDialog
          title="Warning"
          message="Some teams do not have assigned guides. Are you sure you want to continue?"
          onConfirm={() => {
            setShowGuideWarning(false);
            setShowFinalConfirmation(true);
          }}
          onCancel={() => setShowGuideWarning(false)}
        />
      )}

      {showFinalConfirmation && (
        <ConfirmationDialog
          title="Confirm Submission"
          message="Are you sure you want to submit this form?"
          onConfirm={() => {
            setShowFinalConfirmation(false);
            handleFinalSubmit();
          }}
          onCancel={() => setShowFinalConfirmation(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default CreateProjectForm;