// FacultyController.js
import asynchandler from "express-async-handler";
import Faculty from "../models/facultyModel.js";
import SectionTeams from "../models/sectionTeamsModel.js";
import Team from "../models/teamsModel.js";
import Student from "../models/studentModel.js";

// New entity created by faculty
export const createTeams = asynchandler(async (req, res) => {
    try {
        const { newSectionTeam, createdTeams } = req.body;
        const sectionTeam = new SectionTeams({
            classID: newSectionTeam.classID,
            year: newSectionTeam.year,
            sem: newSectionTeam.sem,
            branch: newSectionTeam.branch,
            section: newSectionTeam.section,
            projectType: newSectionTeam.projectType,
            facultyID: newSectionTeam.facultyID,
            numberOfTeams: newSectionTeam.numberOfTeams,
            teamsList: newSectionTeam.teamsList,
            projectTitles: newSectionTeam.projectTitles,
            numberOfStudents: newSectionTeam.numberOfStudents,
            status: newSectionTeam.status
        });

        await sectionTeam.save();

        const teamPromises = createdTeams.map(team => {
            return Team.findOneAndUpdate(
                { teamId: team.teamId },
                {
                    listOfStudents: team.listOfStudents,
                    projectTitle: team.projectTitle,
                    projectType: team.projectType,
                    subject: team.subject,
                    githubURL: "",
                    guideApproval: true,
                    guideFacultyId: team.guideFacultyId,
                    inchargefacultyId: team.inchargefacultyId
                },
                { upsert: true, new: true }
            );
        });

        await Promise.all(teamPromises);
        const projectTitlesArray = Object.values(newSectionTeam.projectTitles); // Extract values
        
        // Update leaded projects for faculty in charge
        await Faculty.findOneAndUpdate(
            { facultyID: newSectionTeam.facultyID },
            { $addToSet: { leadedProjects: { $each: projectTitlesArray } } }, 
            { new: true }
        );
        


        // Update guided projects for faculty guiding specific teams
        const facultyUpdatePromises = createdTeams.map(({ guideFacultyId, projectTitle }) =>
            Faculty.findOneAndUpdate(
                { facultyID: guideFacultyId },
                { $addToSet: { guidedProjects: projectTitle } },
                { new: true }
            )
        );

        await Promise.all(facultyUpdatePromises);
        console.log("Faculty projects updated successfully.");
        
        // const studentUpdatePromises = createdTeams.flatMap(team =>
        //     team.listOfStudents.map(studentId =>
        //         Student.findOneAndUpdate(
        //             { studentID: studentId },
        //             { $addToSet: { projects: team.projectTitle } }, 
        //             { new: true }
        //         )
        //     )
        // );
        
        // await Promise.all(studentUpdatePromises);
        

        res.status(201).json({ message: 'Section team, teams, and student project counts updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving section team, teams, or updating student projects', error: error.message });
        console.log(error.message);
    }
});
