import Faculty from "../models/facultyModel.js";
import asynchandler from "express-async-handler"
export const createTeams = asynchandler(async(req,res,next)=>{
    const { classID, facultyID , year ,sem,branch,section,projectType,noOfteams,teams,projectTitles,noOfStudents,guides } = req.body; // Extracting classID and facultyID from the request body

    try {
        // Find the faculty by facultyID and update the classID
        const updatedFaculty = await Faculty.findOneAndUpdate(
            {facultyID: facultyID }, 
            { classID: classID }, // Updating the classID field
            { new: true } // Return the updated document
        );

        if (!updatedFaculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        return res.status(200).json({ message: 'ClassID updated successfully', updatedFaculty });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }

})