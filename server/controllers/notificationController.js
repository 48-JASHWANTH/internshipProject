import Notification from '../models/Notification.js';
import Student from '../models/studentModel.js';
import Faculty from '../models/facultyModel.js';
import { sendNotification } from '../services/notificationService.js';

// Create a new notification and store it in database
export const createNotification = async (req, res) => {
  try {
    const { title, body, type, recipients, recipientModel, relatedProject } = req.body;
    
    if (!title || !body || !recipients || !recipientModel) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Ensure recipients is an array of strings
    const recipientIds = Array.isArray(recipients) ? recipients : [recipients];
    
    // Create the notification
    const notification = await Notification.create({
      title,
      body,
      type: type || 'general',
      recipients: recipientIds,
      recipientModel,
      relatedProject,
      isRead: recipientIds.reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {})
    });
    
    // Add notification ID to each recipient's notifications array
    if (recipientModel === 'Student') {
      await Promise.all(recipientIds.map(async (studentId) => {
        await Student.findOneAndUpdate(
          { studentID: studentId },
          { $push: { notifications: notification._id.toString() } }
        );
      }));
    } else if (recipientModel === 'Faculty') {
      await Promise.all(recipientIds.map(async (facultyId) => {
        await Faculty.findOneAndUpdate(
          { facultyID: facultyId },
          { $push: { notifications: notification._id.toString() } }
        );
      }));
    }
    
    // Send push notification
    await sendNotification(recipientIds, title, body);
    
    return res.status(201).json({ 
      success: true, 
      notification 
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating notification',
      error: error.message 
    });
  }
};

// Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    
    if (!userId || !userType) {
      return res.status(400).json({ message: 'User ID and type are required' });
    }
    
    // Find notifications where the user is a recipient
    const notifications = await Notification.find({
      recipients: userId,
      recipientModel: userType === 'student' ? 'Student' : 'Faculty'
    }).sort({ createdAt: -1 });
    
    return res.status(200).json({ 
      success: true, 
      notifications 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching notifications',
      error: error.message 
    });
  }
};

// Mark notification as read for a specific user
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;
    
    if (!notificationId || !userId) {
      return res.status(400).json({ message: 'Notification ID and User ID are required' });
    }
    
    // Update the isRead status for this user
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Update the isRead map
    notification.isRead.set(userId, true);
    await notification.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Notification marked as read' 
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error marking notification as read',
      error: error.message 
    });
  }
};

// Create notification from project creation
export const createProjectNotification = async (req, res) => {
  try {
    const { projectTitle, studentIds, guideFacultyId, inchargeFacultyId, projectType } = req.body;
    
    // Create recipients list - all students and faculty members
    const studentRecipients = studentIds || [];
    const facultyRecipients = [];
    
    if (guideFacultyId) facultyRecipients.push(guideFacultyId);
    if (inchargeFacultyId) facultyRecipients.push(inchargeFacultyId);
    
    // Create notifications for students
    if (studentRecipients.length > 0) {
      await Notification.create({
        title: 'New Project Assignment',
        body: `You have been assigned to the project "${projectTitle}"`,
        type: 'project',
        recipients: studentRecipients,
        recipientModel: 'Student',
        isRead: studentRecipients.reduce((acc, id) => {
          acc[id] = false;
          return acc;
        }, {})
      });
      
      // Add notification to student records
      const notification = await Notification.findOne({
        title: 'New Project Assignment',
        body: `You have been assigned to the project "${projectTitle}"`,
        recipientModel: 'Student'
      }).sort({ createdAt: -1 });
      
      await Promise.all(studentRecipients.map(async (studentId) => {
        await Student.findOneAndUpdate(
          { studentID: studentId },
          { $push: { notifications: notification._id.toString() } }
        );
      }));
      
      // Send push notifications to students
      await sendNotification(studentRecipients, 'New Project Assignment', `You have been assigned to the project "${projectTitle}"`);
    }
    
    // Create notifications for faculty
    if (facultyRecipients.length > 0) {
      const role = projectType === 'Mini Project' ? 'Incharge' : 'Guide';
      
      await Notification.create({
        title: `New Project as ${role}`,
        body: `You have been assigned as ${role.toLowerCase()} for the project "${projectTitle}"`,
        type: 'project',
        recipients: facultyRecipients,
        recipientModel: 'Faculty',
        isRead: facultyRecipients.reduce((acc, id) => {
          acc[id] = false;
          return acc;
        }, {})
      });
      
      // Add notification to faculty records
      const notification = await Notification.findOne({
        title: `New Project as ${role}`,
        body: `You have been assigned as ${role.toLowerCase()} for the project "${projectTitle}"`,
        recipientModel: 'Faculty'
      }).sort({ createdAt: -1 });
      
      await Promise.all(facultyRecipients.map(async (facultyId) => {
        await Faculty.findOneAndUpdate(
          { facultyID: facultyId },
          { $push: { notifications: notification._id.toString() } }
        );
      }));
      
      // Send push notifications to faculty
      await sendNotification(facultyRecipients, `New Project as ${role}`, `You have been assigned as ${role.toLowerCase()} for the project "${projectTitle}"`);
    }
    
    return res.status(201).json({ 
      success: true, 
      message: 'Project notifications created successfully' 
    });
  } catch (error) {
    console.error('Error creating project notifications:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating project notifications',
      error: error.message 
    });
  }
};

// Create notification when a new task is assigned
export const createTaskNotification = async (req, res) => {
  try {
    const { 
      title,
      description, 
      dueDate, 
      priority, 
      projectTitle,
      projectId,
      studentIds,
      assignedBy
    } = req.body;
    
    if (!title || !studentIds || !projectTitle) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Ensure studentIds is an array
    const recipients = Array.isArray(studentIds) ? studentIds : [studentIds];
    
    // Format due date
    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get faculty role (default to "Faculty" if not specified)
    const facultyRole = assignedBy?.type || "Faculty";
    const facultyName = assignedBy?.name || "Your faculty";
    
    // Create an enhanced, formatted notification content
    const notificationTitle = 'New Task Assigned';
    const notificationBody = `📋 TASK DETAILS
───────────────────
• Title: ${title}
• Project: ${projectTitle}
• Due Date: ${formattedDate}
• Priority: ${priority}

📝 DESCRIPTION
───────────────────
${description}

👤 ASSIGNED BY
───────────────────
${facultyName} (${facultyRole})

⚠️ Please complete this task before the deadline.`;
    
    // Create notification object
    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      type: 'activity',
      recipients: recipients,
      recipientModel: 'Student',
      isRead: recipients.reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {})
    };
    
    // Only add relatedProject if it's a valid ObjectId
    // MongoDB ObjectIds are typically 24 hex characters
    if (projectId && /^[0-9a-fA-F]{24}$/.test(projectId)) {
      notificationData.relatedProject = projectId;
    }
    
    // Create notification in database
    const notification = await Notification.create(notificationData);
    
    // Add notification to student records
    await Promise.all(recipients.map(async (studentId) => {
      await Student.findOneAndUpdate(
        { studentID: studentId },
        { $push: { notifications: notification._id.toString() } }
      );
    }));
    
    // Send push notification
    await sendNotification(recipients, notificationTitle, notificationBody);
    
    return res.status(201).json({ 
      success: true, 
      message: 'Task notifications sent successfully' 
    });
  } catch (error) {
    console.error('Error creating task notifications:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating task notifications',
      error: error.message 
    });
  }
};

// Create notification when a new review is assigned
export const createReviewNotification = async (req, res) => {
  try {
    console.log('--------------- REVIEW NOTIFICATION DEBUG ---------------');
    console.log('Review notification request received with body:', req.body);
    
    const { 
      reviewName,
      dateOfReview,
      satisfactionLevel,
      feedback,
      progress,
      projectTitle,
      projectId,
      studentIds,
      assignedBy
    } = req.body;
    
    console.log('Extracted studentIds:', studentIds);
    console.log('Extracted projectId:', projectId);
    console.log('Extracted reviewName:', reviewName);
    
    // Ensure required fields are present
    if (!reviewName || !studentIds) {
      console.error('Missing required fields for review notification');
      console.error('reviewName:', reviewName);
      console.error('studentIds:', studentIds);
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: review name and student IDs are required' 
      });
    }
    
    // Use default project title if missing
    const finalProjectTitle = projectTitle || 'your project';
    console.log('Using project title:', finalProjectTitle);
    
    // Ensure studentIds is an array
    const recipients = Array.isArray(studentIds) ? studentIds : [studentIds];
    console.log('Processed recipients:', recipients);
    
    // Format review date
    const formattedDate = new Date(dateOfReview).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get faculty role (default to "Faculty" if not specified)
    const facultyRole = assignedBy?.type || "Faculty";
    const facultyName = assignedBy?.name || "Your faculty";
    
    // Create an enhanced, formatted notification content
    const notificationTitle = 'New Review Added';
    const notificationBody = `📋 REVIEW DETAILS
───────────────────
• Review: ${reviewName}
• Project: ${finalProjectTitle}
• Date: ${formattedDate}
• Satisfaction: ${satisfactionLevel}

📝 FEEDBACK
───────────────────
${feedback}

📊 PROGRESS
───────────────────
${progress}

👤 REVIEWED BY
───────────────────
${facultyName} (${facultyRole})

⚠️ Please check your project review.`;
    
    // Create notification object
    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      type: 'review',
      recipients: recipients,
      recipientModel: 'Student',
      isRead: recipients.reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {})
    };
    
    console.log('Created notification data:', notificationData);
    console.log('Checking projectId format:', projectId);
    
    // Only add relatedProject if it's a valid ObjectId
    // MongoDB ObjectIds are typically 24 hex characters
    if (projectId && /^[0-9a-fA-F]{24}$/.test(projectId)) {
      console.log('Adding projectId as relatedProject');
      notificationData.relatedProject = projectId;
    } else {
      console.log('ProjectId not in MongoDB ObjectId format, skipping relatedProject');
    }
    
    // Create notification in database
    console.log('Creating notification in database');
    const notification = await Notification.create(notificationData);
    console.log('Notification created with ID:', notification._id.toString());
    
    // Add notification to student records
    console.log('Adding notification to student records for recipients:', recipients);
    await Promise.all(recipients.map(async (studentId) => {
      try {
        console.log(`Updating student ${studentId} with notification ${notification._id}`);
        const updateResult = await Student.findOneAndUpdate(
          { studentID: studentId },
          { $push: { notifications: notification._id.toString() } }
        );
        console.log(`Update result for student ${studentId}:`, updateResult ? 'success' : 'not found');
      } catch (studentError) {
        console.error(`Error updating student ${studentId}:`, studentError);
      }
    }));
    
    // Send push notification
    console.log('Sending push notification to recipients:', recipients);
    await sendNotification(recipients, notificationTitle, notificationBody);
    console.log('Push notification sent');
    console.log('--------------- END REVIEW NOTIFICATION DEBUG ---------------');
    
    return res.status(201).json({ 
      success: true, 
      message: 'Review notifications sent successfully' 
    });
  } catch (error) {
    console.error('Error creating review notifications:', error);
    console.error('Error details:', error.stack);
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating review notifications',
      error: error.message 
    });
  }
};

// Create notification when a new forum project is posted
export const createForumProjectNotification = async (req, res) => {
  try {
    console.log('--------------- FORUM PROJECT NOTIFICATION DEBUG ---------------');
    console.log('Forum project notification request received with body:', req.body);
    
    const { 
      projectTitle,
      projectId, 
      domain,
      techStack,
      description,
      faculty
    } = req.body;
    
    if (!projectTitle) {
      console.error('Missing required field: projectTitle');
      return res.status(400).json({ 
        success: false, 
        message: 'Project title is required' 
      });
    }
    
    // Fetch all active students from database
    console.log('Fetching all active students from database');
    const students = await Student.find({ isActive: true }).select('studentID');
    console.log(`Found ${students.length} active students`);
    
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active students found to notify'
      });
    }
    
    // Get all student IDs
    const studentIds = students.map(student => student.studentID);
    console.log('Student IDs to notify:', studentIds);
    
    // Format project information for notification
    const facultyName = faculty?.name || 'A faculty member';
    const facultyDept = faculty?.department || 'the department';
    
    // Create notification content
    const notificationTitle = 'New Project Opportunity Available';
    const notificationBody = `📋 PROJECT DETAILS
───────────────────
• Title: ${projectTitle}
• Domain: ${domain || 'N/A'}
• Tech Stack: ${techStack || 'N/A'}

📝 DESCRIPTION
───────────────────
${description || 'No description provided'}

👤 POSTED BY
───────────────────
${facultyName} (${facultyDept})

⚠️ Check Project Forum for more details and to join this project.`;
    
    // Create notification object
    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      type: 'forum',
      recipients: studentIds,
      recipientModel: 'Student',
      isRead: studentIds.reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {})
    };
    
    // Add projectId if provided and valid
    if (projectId) {
      console.log('Adding projectId to notification:', projectId);
      notificationData.relatedProject = projectId;
    }
    
    console.log('Creating notification in database');
    const notification = await Notification.create(notificationData);
    console.log('Notification created with ID:', notification._id.toString());
    
    // Add notification to each student's record
    console.log('Adding notification to student records');
    await Promise.all(studentIds.map(async (studentId) => {
      try {
        console.log(`Updating student ${studentId} with notification ${notification._id}`);
        const updateResult = await Student.findOneAndUpdate(
          { studentID: studentId },
          { $push: { notifications: notification._id.toString() } }
        );
        if (!updateResult) {
          console.log(`Student ${studentId} not found`);
        }
      } catch (studentError) {
        console.error(`Error updating student ${studentId}:`, studentError);
      }
    }));
    
    // Send push notification
    console.log('Sending push notification to all students');
    await sendNotification(studentIds, notificationTitle, notificationBody);
    console.log('Push notification sent');
    console.log('--------------- END FORUM PROJECT NOTIFICATION DEBUG ---------------');
    
    return res.status(201).json({ 
      success: true, 
      message: 'Forum project notifications sent successfully',
      notifiedStudents: studentIds.length
    });
  } catch (error) {
    console.error('Error creating forum project notifications:', error);
    console.error('Error details:', error.stack);
    return res.status(500).json({ 
      success: false, 
      message: 'Error creating forum project notifications',
      error: error.message 
    });
  }
};

// Create notification when a student completes a task
export const createTaskCompletionNotification = async (req, res) => {
  try {
    console.log('--------------- TASK COMPLETION NOTIFICATION DEBUG ---------------');
    console.log('Task completion notification request received with body:', req.body);
    console.log('Request user:', req.user);
    
    const { 
      taskId,
      taskTitle,
      studentId,
      studentName,
      projectId,
      facultyId,
      completedAt
    } = req.body;
    
    if (!taskTitle) {
      console.error('Missing required field: taskTitle');
      return res.status(400).json({ 
        success: false, 
        message: 'Task title is required' 
      });
    }
    
    const studentIdToUse = studentId || (req.user?.studentID ? req.user.studentID : null);
    const studentNameToUse = studentName || (req.user?.name ? req.user.name : studentIdToUse);
    
    console.log('Using student info:', {
      id: studentIdToUse,
      name: studentNameToUse
    });
    
    // Get faculty ID (who assigned the task)
    let recipientId = facultyId || '00CSE007'; // Use a default faculty ID if none provided
    console.log('Using faculty ID for notification:', recipientId);
    
    // Create notification content
    const notificationTitle = 'Task Completed by Student';
    const notificationBody = `✅ TASK COMPLETION NOTIFICATION
───────────────────
• Task: ${taskTitle || 'Unnamed Task'}
• Completed by: ${studentNameToUse || 'A student'}
• Completed on: ${new Date().toLocaleString()}

The task has been marked as completed and is ready for your review.`;
    
    console.log('Creating notification with content:', {
      title: notificationTitle,
      body: notificationBody
    });
    
    // Create the notification directly using the model
    try {
      // First, create the notification document
      const notification = new Notification({
        title: notificationTitle,
        body: notificationBody,
        type: 'activity',
        recipients: [recipientId],
        recipientModel: 'Faculty',
        isRead: { [recipientId]: false }
      });
      
      if (projectId) {
        notification.relatedProject = projectId;
      }
      
      // Save the notification to the database
      const savedNotification = await notification.save();
      console.log('Notification saved with ID:', savedNotification._id);
      
      // Update the faculty document to include this notification
      const facultyUpdateResult = await Faculty.findOneAndUpdate(
        { facultyID: recipientId },
        { $push: { notifications: savedNotification._id.toString() } }
      );
      
      console.log('Faculty update result:', facultyUpdateResult ? 'Success' : 'Faculty not found');
      
      // Try to send a push notification
      console.log('Attempting to send push notification');
      await sendNotification([recipientId], notificationTitle, notificationBody);
      
      return res.status(201).json({
        success: true,
        message: 'Task completion notification sent successfully',
        notification: savedNotification
      });
    } catch (dbError) {
      console.error('Database error creating notification:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error creating notification in database',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Error in task completion notification:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing task completion notification',
      error: error.message 
    });
  }
};

// Test function to create a direct notification to faculty
export const createTestNotificationForFaculty = async (req, res) => {
  try {
    console.log('--------------- TEST FACULTY NOTIFICATION DEBUG ---------------');
    console.log('Creating test notification for faculty');
    
    const facultyId = req.body.facultyId || '00CSE007'; // Default to a known faculty ID
    console.log('Using faculty ID:', facultyId);
    
    // Create a simple test notification
    const testNotification = new Notification({
      title: 'Test Notification',
      body: `This is a test notification sent at ${new Date().toLocaleString()}.`,
      type: 'general',
      recipients: [facultyId],
      recipientModel: 'Faculty',
      isRead: { [facultyId]: false }
    });
    
    // Save the notification
    const savedNotification = await testNotification.save();
    console.log('Test notification saved with ID:', savedNotification._id);
    
    // Update faculty document
    const facultyUpdateResult = await Faculty.findOneAndUpdate(
      { facultyID: facultyId },
      { $push: { notifications: savedNotification._id.toString() } },
      { new: true }
    );
    
    console.log('Faculty update result:', facultyUpdateResult ? 
      `Success: now has ${facultyUpdateResult.notifications.length} notifications` : 
      'Faculty not found');
    
    // Try to send push notification
    await sendNotification([facultyId], 'Test Notification', `This is a test notification sent at ${new Date().toLocaleString()}.`);
    
    return res.status(201).json({
      success: true,
      message: 'Test notification created successfully',
      notification: savedNotification,
      faculty: facultyUpdateResult || null
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating test notification',
      error: error.message
    });
  }
}; 