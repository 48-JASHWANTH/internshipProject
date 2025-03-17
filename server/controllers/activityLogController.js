import ActivityLog from "../models/activityLogModel.js";

// Log a user activity
export const logActivity = async (req, res) => {
  try {
    const { userId, userType, action, details } = req.body;
    
    // Get IP address and user agent
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const deviceInfo = req.headers['user-agent'] || '';
    
    const newLog = new ActivityLog({
      userId,
      userType,
      action,
      details,
      ipAddress,
      deviceInfo
    });
    
    await newLog.save();
    
    res.status(201).json({
      success: true,
      message: "Activity logged successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging activity",
      error: error.message
    });
  }
};

// Retrieve user activity logs with filtering
export const getUserActivity = async (req, res) => {
  try {
    const { userId, userType, startDate, endDate, actionType, limit = 100 } = req.query;
    
    // Build filter based on query parameters
    const filter = {};
    if (userId) filter.userId = userId;
    if (userType) filter.userType = userType;
    if (actionType) filter.action = actionType;
    
    // Add date range filter if provided
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    const logs = await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving activity logs",
      error: error.message
    });
  }
};

// Get currently online users (active in the last 15 minutes)
export const getCurrentlyOnline = async (req, res) => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    // Find users with login or activity in the last 15 minutes
    const onlineUsers = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: fifteenMinutesAgo },
          action: { $in: ["Login", "Page View", "API Request"] }
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$userId",
          userType: { $first: "$userType" },
          lastActivity: { $first: "$timestamp" },
          ipAddress: { $first: "$ipAddress" }
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userType: 1,
          lastActivity: 1,
          ipAddress: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      count: onlineUsers.length,
      onlineUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving online users",
      error: error.message
    });
  }
};

// Detect suspicious activities
export const getSuspiciousActivities = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find failed login attempts
    const failedLogins = await ActivityLog.aggregate([
      {
        $match: {
          action: "Failed Login",
          timestamp: { $gte: twentyFourHoursAgo }
        }
      },
      {
        $group: {
          _id: { userId: "$userId", ipAddress: "$ipAddress" },
          count: { $sum: 1 },
          lastAttempt: { $max: "$timestamp" }
        }
      },
      {
        $match: {
          count: { $gte: 3 } // 3 or more failed attempts
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          ipAddress: "$_id.ipAddress",
          failedAttempts: "$count",
          lastAttempt: 1,
          reason: { $literal: "Multiple failed login attempts" }
        }
      }
    ]);
    
    // Find logins from different locations
    const multiLocationLogins = await ActivityLog.aggregate([
      {
        $match: {
          action: "Login",
          timestamp: { $gte: twentyFourHoursAgo }
        }
      },
      {
        $group: {
          _id: "$userId",
          ipAddresses: { $addToSet: "$ipAddress" },
          lastLogin: { $max: "$timestamp" }
        }
      },
      {
        $match: {
          "ipAddresses.1": { $exists: true } // At least 2 different IPs
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          ipAddresses: 1,
          lastLogin: 1,
          reason: { $literal: "Logins from multiple IP addresses" }
        }
      }
    ]);
    
    // Combine suspicious activities
    const suspiciousEvents = [...failedLogins, ...multiLocationLogins];
    
    res.status(200).json({
      success: true,
      count: suspiciousEvents.length,
      suspiciousEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving suspicious activities",
      error: error.message
    });
  }
};

// Generate user statistics
export const getUserStatistics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Get total logins in the last 30 days
    const totalLogins = await ActivityLog.countDocuments({
      action: "Login",
      timestamp: { $gte: thirtyDaysAgo }
    });
    
    // Get unique active users in the last 30 days
    const activeUsers = await ActivityLog.distinct("userId", {
      timestamp: { $gte: thirtyDaysAgo }
    });
    
    // Get most active hours
    const hourlyActivity = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $project: {
          hour: { $hour: "$timestamp" }
        }
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 1
      }
    ]);
    
    // Get top actions
    const topActions = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Format the top actions into an object
    const topActionsObject = {};
    topActions.forEach(action => {
      topActionsObject[action._id] = action.count;
    });
    
    // Format the most active hour
    let mostActiveHour = "No data";
    if (hourlyActivity.length > 0) {
      const hour = hourlyActivity[0]._id;
      mostActiveHour = `${hour}:00 - ${hour + 1}:00`;
    }
    
    res.status(200).json({
      success: true,
      statistics: {
        totalLogins,
        activeUsers: activeUsers.length,
        mostActiveHours: mostActiveHour,
        topActions: topActionsObject
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating user statistics",
      error: error.message
    });
  }
}; 