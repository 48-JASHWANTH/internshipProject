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
    // Check if any team lacks a guide
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
    // Generate a unique classID based on timestamp
    const classID = Date.now().toString();
    
    // Format teams data to match API structure
    const teamsObject = {};
    const projectTitlesObject = {};
    const guidesObject = {};
    
    excelData.forEach((team, index) => {
      const teamId = `${classID}_${index + 1}`;
      teamsObject[teamId] = team.students.map(student => student.rollNo);
      projectTitlesObject[teamId] = team.projectTitle;
      guidesObject[teamId] = team.guide?.startsWith('G') ? team.guide : `G${Math.floor(10000 + Math.random() * 90000)}`; // Generate guide ID if not in correct format
    });

    const finalRequestData = {
      facultyID: "FAC12345", // This would typically come from auth context
      year: formData.year,
      sem: formData.semester,
      branch: formData.branch,
      section: formData.section,
      projectType: formData.projectType,
      classID: classID,
      noOfTeams: excelData.length,
      noOfStudents: excelData.reduce((acc, team) => acc + team.students.length, 0),
      subject: formData.projectType === "Course Based Project(CBP)" ? formData.subject : "Not Applicable",
      guideApproval: true,
      teams: teamsObject,
      projectTitles: projectTitlesObject,
      guides: guidesObject
    };

    // Log the formatted request data
    console.log("API Request Data:", finalRequestData);
    console.log("Expected API Response:", {
      message: 'ClassID added to leadedProjects, SectionTeams and individual Teams created successfully',
      updatedFaculty: {
        facultyID: finalRequestData.facultyID,
        leadedProjects: [finalRequestData.classID]
        // Other faculty fields would be here
      },
      newSectionTeam: {
        classID: finalRequestData.classID,
        year: finalRequestData.year,
        sem: finalRequestData.sem,
        branch: finalRequestData.branch,
        section: finalRequestData.section,
        projectType: finalRequestData.projectType,
        facultyID: finalRequestData.facultyID,
        numberOfTeams: finalRequestData.noOfTeams,
        teamsList: finalRequestData.teams,
        projectTitles: finalRequestData.projectTitles,
        numberOfStudents: finalRequestData.noOfStudents,
        status: 'Pending'
      },
      createdTeams: Object.keys(teamsObject).map(teamId => ({
        teamId,
        listOfStudents: teamsObject[teamId],
        projectTitle: projectTitlesObject[teamId],
        projectType: finalRequestData.projectType,
        subject: finalRequestData.subject,
        githubURL: "",
        guideApproval: finalRequestData.guideApproval,
        guideFacultyId: guidesObject[teamId],
        inchargefacultyId: finalRequestData.facultyID
      }))
    });

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

      {/* Guide Warning Dialog */}
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

      {/* Final Confirmation Dialog */}
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
