// FacultyController.js
import mongoose from "mongoose";
import asynchandler from "express-async-handler";
import Faculty from "../models/FacultyModel.js";
import SectionTeams from "../models/SectionTeamsModel.js";
import Team from "../models/teamsModel.js";

// New entity created by faculty
export const createTeams = asynchandler(async (req, res) => {
    const { 
        classID, 
        facultyID, 
        year, 
        sem, 
        branch, 
        section, 
        projectType, 
        noOfTeams, 
        teams, 
        projectTitles, 
        noOfStudents, 
        guides, 
        subject, 
        guideApproval 
    } = req.body;

    try {
        const updatedFaculty = await Faculty.findOneAndUpdate(
            { facultyID: facultyID },
            { $push: { leadedProjects: classID } },
            { new: true }
        );

        if (!updatedFaculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const newSectionTeam = new SectionTeams({
            classID,
            year,
            sem,
            branch,
            section,
            projectType,
            facultyID,
            numberOfTeams: noOfTeams,
            teamsList: teams,
            projectTitles: new Map(Object.entries(projectTitles)),
            numberOfStudents: noOfStudents,
            status: 'Pending'
        });

        await newSectionTeam.save();

        const teamPromises = Object.entries(teams).map(async ([teamId, studentList]) => {
            const newTeam = new Team({
                teamId,
                listOfStudents: studentList,
                projectTitle: projectTitles[teamId],
                projectType,
                subject,
                githubURL: "", // Placeholder, assuming it will be updated later
                guideApproval: guideApproval || false,
                guideFacultyId: guides[teamId] || "",
                inchargefacultyId: facultyID
            });
            return await newTeam.save();
        });

        const createdTeams = await Promise.all(teamPromises);

        return res.status(200).json({
            message: 'ClassID added to leadedProjects, SectionTeams and individual Teams created successfully',
            updatedFaculty,
            newSectionTeam,
            createdTeams
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
