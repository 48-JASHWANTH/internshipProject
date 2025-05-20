import Faculty from "../models/facultyModel.js";

// Add faculty
export const addFaculty = async (req, res) => {
  try {
    const { faculties, details } = req.body; // Get faculties and details from request
    
    const createdFaculties = await Promise.all(
      Object.entries(faculties).map(async ([facultyID, name]) => {
        // Get department and designation from details if available
        const facultyDetails = details && details[facultyID] ? details[facultyID] : {};
        
        return await Faculty.create({
          facultyID,
          name,
          department: facultyDetails.department || '',  // Add department from details
          designation: facultyDetails.designation || '' // Add designation from details
        });
      })
    );
    
    res.status(201).json({
      success: true,
      message: `Successfully added ${createdFaculties.length} faculty members`,
      faculties: createdFaculties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding faculty members",
      error: error.message
    });
  }
};

// Get all faculty members with complete details
export const listAllFaculty = async (req, res) => {
  try {
    const { department, designation, status, basic } = req.query;
    
    // Build filter based on query parameters
    const filter = { softDeleted: false }; // Explicitly exclude soft-deleted faculty
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (status) filter.status = status;
    
    // Determine which fields to select based on whether basic view is requested
    // By default, return all details except sensitive information
    const projection = basic === 'true' ? 
      'facultyID facultyID name department designation status email phoneNumber' : // Basic fields
      '-password -__v'; // Include all fields except password and version
    
    const faculties = await Faculty.find(filter)
      .select(projection)
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: faculties.length,
      faculties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching faculty members",
      error: error.message
    });
  }
};

// Get faculty details by ID with complete information
export const getFacultyDetails = async (req, res) => {
  try {
    const { facultyID } = req.params;
    
    // Explicitly check that faculty is not soft-deleted
    const faculty = await Faculty.findOne({ 
      facultyID, 
      softDeleted: false 
    }).select('-password -__v'); // Exclude sensitive information
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found or has been deactivated"
      });
    }
    
    res.status(200).json({
      success: true,
      faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching faculty details",
      error: error.message
    });
  }
};

// Update faculty
export const updateFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;
    const updates = req.body;
    
    // Fields that cannot be updated
    const restrictedFields = ['password', 'facultyID', 'facultyID', 'softDeleted', 'deletedAt'];
    
    // Remove restricted fields from updates
    restrictedFields.forEach(field => {
      if (updates[field] !== undefined) {
        delete updates[field];
      }
    });
    
    // Explicitly check that faculty is not soft-deleted
    const faculty = await Faculty.findOne({ 
      facultyID, 
      softDeleted: false 
    });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found or has been deactivated"
      });
    }
    
    // Update the faculty
    const updatedFaculty = await Faculty.findOneAndUpdate(
      { facultyID, softDeleted: false }, // Only update if not soft-deleted
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: `Faculty ${facultyID} has been updated`,
      faculty: updatedFaculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating faculty",
      error: error.message
    });
  }
};

// Soft delete faculty
export const softDeleteFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;
    
    // First check if faculty exists and is not already deleted
    const faculty = await Faculty.findOne({ facultyID });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found"
      });
    }
    
    // Check if already soft deleted
    if (faculty.softDeleted) {
      return res.status(400).json({
        success: false,
        message: `Faculty ${facultyID} is already deactivated`
      });
    }
    
    // Perform soft delete
    await Faculty.findOneAndUpdate(
      { facultyID },
      { 
        softDeleted: true,
        deletedAt: new Date(),
        status: "Inactive"
      }
    );
    
    res.status(200).json({
      success: true,
      message: `Faculty ${facultyID} has been deactivated`,
      facultyID
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deactivating faculty",
      error: error.message
    });
  }
};

// Restore faculty
export const restoreFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;
    
    // Bypass the middleware by using findOneAndUpdate directly
    const faculty = await Faculty.findOneAndUpdate(
      { facultyID, softDeleted: true },
      { 
        softDeleted: false,
        deletedAt: null,
        status: "Active"
      },
      { new: true }
    ).lean();
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Deleted faculty not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Faculty ${facultyID} has been restored`,
      faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error restoring faculty",
      error: error.message
    });
  }
};

// List deleted faculty
export const listDeletedFaculty = async (req, res) => {
  try {
    // Use direct MongoDB query to bypass Mongoose middleware
    const deletedFaculty = await Faculty.collection.find(
      { softDeleted: true }
    ).toArray();
    
    // Format the response
    const formattedFaculty = deletedFaculty.map(faculty => ({
      facultyID: faculty.facultyID,
      name: faculty.name,
      department: faculty.department,
      designation: faculty.designation,
      deletedAt: faculty.deletedAt,
      status: faculty.status,
      softDeleted: faculty.softDeleted
    }));
    
    res.status(200).json({
      success: true,
      count: formattedFaculty.length,
      faculties: formattedFaculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching deleted faculty",
      error: error.message
    });
  }
};

// Function to bulk update multiple faculty members
export const bulkUpdateFaculty = async (req, res) => {
  try {
    const { faculty } = req.body;
    
    if (!faculty || !Array.isArray(faculty) || faculty.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Please provide an array of faculty updates."
      });
    }
    
    // Fields that cannot be updated
    const restrictedFields = ['password', 'facultyID', 'softDeleted', 'deletedAt'];
    
    // Process each faculty update
    const updateResults = await Promise.all(
      faculty.map(async (facultyUpdate) => {
        const { facultyID, ...updates } = facultyUpdate;
        
        if (!facultyID) {
          return { 
            success: false, 
            facultyID: null, 
            message: "Missing facultyID" 
          };
        }
        
        // Remove restricted fields
        restrictedFields.forEach(field => {
          if (updates[field] !== undefined) {
            delete updates[field];
          }
        });
        
        try {
          // Find and verify faculty exists and is not soft-deleted
          const existingFaculty = await Faculty.findOne({ 
            facultyID, 
            softDeleted: false 
          });
          
          if (!existingFaculty) {
            return { 
              success: false, 
              facultyID, 
              message: "Faculty not found or has been deactivated" 
            };
          }
          
          // Update the faculty
          const updatedFaculty = await Faculty.findOneAndUpdate(
            { facultyID, softDeleted: false },
            { $set: updates },
            { new: true, runValidators: true }
          );
          
          return { 
            success: true, 
            facultyID, 
            message: "Updated successfully" 
          };
        } catch (error) {
          return { 
            success: false, 
            facultyID, 
            message: error.message 
          };
        }
      })
    );
    
    const successful = updateResults.filter(result => result.success);
    const failed = updateResults.filter(result => !result.success);
    
    res.status(200).json({
      success: true,
      message: `Updated ${successful.length} faculty members, ${failed.length} failed`,
      results: updateResults
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error performing bulk faculty update",
      error: error.message
    });
  }
}; 