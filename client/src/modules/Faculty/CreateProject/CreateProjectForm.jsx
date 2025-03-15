import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectFormInput from "./ProjectFormInput";
import ProjectFormConfirmation from "./ProjectFormConfirmation";
import ConfirmationDialog from "../../common/ConfirmationDialog";

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);
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

  const handleFinalSubmit = () => {
    const facultyID = "FAC12345";
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
        status: 'Pending'
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

    // Single console log with the final response only
    console.log("Final Response:", responseData);

    navigate("/Faculty/Projects");
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
        />
      )}
    </div>
  );
};

export default CreateProjectForm;