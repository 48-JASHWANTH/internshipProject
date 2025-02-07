import mongoose from "mongoose";
import asynchandler from "express-async-handler";
import Faculty from "../models/FacultyModel.js";
import SectionTeams from "../models/SectionTeamsModel.js";

//New entitity created by faculty
export const createTeams = asynchandler(async (req, res) => {
    const { classID, facultyID, year, sem, branch, section, projectType, noOfTeams, teams, projectTitles, noOfStudents } = req.body;

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

        return res.status(200).json({
            message: 'ClassID added to leadedProjects and SectionTeams created successfully',
            updatedFaculty,
            newSectionTeam
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
