const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { applyCache } = require('../middleware/cache');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const Quest = require('../models/Quest');
const UserQuest = require('../models/UserQuest');
const StudySession = require('../models/StudySession');
const Grade = require('../models/Grade');
const Event = require('../models/Event');
const Activity = require('../models/Activity');
const router = express.Router();

// Get all dashboard data in a single request (heavily cached - 2 minutes)
router.get('/', isAuthenticated, applyCache(120), async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Use Promise.all to run all queries in parallel
    const [
      user,
      stats,
      activeQuests,
      upcomingDeadlines,
      upcomingEvents,
      leaderboard,
      recentActivity
    ] = await Promise.all([
      // User profile (lean for faster processing)
      User.findById(userId).select('name avatar title level xp coins streak').lean(),
      
      // User stats
      getUserStats(userId),
      
      // Active quests (limit to 3)
      getActiveQuests(userId),
      
      // Upcoming deadlines (limit to 3)
      getUpcomingDeadlines(userId),
      
      // Upcoming events (limit to 3)
      getUpcomingEvents(),
      
      // Leaderboard (top 5)
      getLeaderboard(userId),
      
      // Recent activity (limit to 5)
      getRecentActivity(userId)
    ]);
    
    // Return all data in a single response
    res.json({
      user,
      stats,
      activeQuests,
      upcomingDeadlines,
      upcomingEvents,
      leaderboard,
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Get user stats
router.get('/stats', isAuthenticated, applyCache(60), async (req, res) => {
  try {
    const stats = await getUserStats(req.session.userId);
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// Get active quests
router.get('/quests', isAuthenticated, applyCache(60), async (req, res) => {
  try {
    const quests = await getActiveQuests(req.session.userId);
    res.json(quests);
  } catch (error) {
    console.error('Quests error:', error);
    res.status(500).json({ error: 'Failed to load quests' });
  }
});

// Get upcoming deadlines
router.get('/deadlines', isAuthenticated, applyCache(60), async (req, res) => {
  try {
    const deadlines = await getUpcomingDeadlines(req.session.userId);
    res.json(deadlines);
  } catch (error) {
    console.error('Deadlines error:', error);
    res.status(500).json({ error: 'Failed to load deadlines' });
  }
});

// Get upcoming events
router.get('/events', isAuthenticated, applyCache(60), async (req, res) => {
  try {
    const events = await getUpcomingEvents();
    res.json(events);
  } catch (error) {
    console.error('Events error:', error);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

// Get leaderboard
router.get('/leaderboard', isAuthenticated, applyCache(300), async (req, res) => {
  try {
    const leaderboard = await getLeaderboard(req.session.userId);
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// Get recent activity
router.get('/activity', isAuthenticated, applyCache(60), async (req, res) => {
  try {
    const activity = await getRecentActivity(req.session.userId);
    res.json(activity);
  } catch (error) {
    console.error('Activity error:', error);
    res.status(500).json({ error: 'Failed to load activity' });
  }
});

// Helper function to get user stats
async function getUserStats(userId) {
  // Run queries in parallel
  const [
    completedAssignments,
    pendingAssignments,
    grades,
    studySessions
  ] = await Promise.all([
    Assignment.countDocuments({ userId, status: 'completed' }),
    Assignment.countDocuments({ userId, status: 'pending' }),
    Grade.find({ userId }).select('grade weight').lean(),
    StudySession.find({ userId }).select('duration').lean()
  ]);
  
  // Calculate GPA
  let gpa = 0;
  let totalWeight = 0;
  
  if (grades.length > 0) {
    grades.forEach(grade => {
      gpa += grade.grade * (grade.weight || 1);
      totalWeight += (grade.weight || 1);
    });
    
    gpa = totalWeight > 0 ? gpa / totalWeight : 0;
  }
  
  // Calculate total study minutes
  const studyMinutes = studySessions.reduce((total, session) => total + (session.duration || 0), 0);
  
  return {
    completedTasks: completedAssignments,
    pendingTasks: pendingAssignments,
    gpa,
    studyMinutes
  };
}

// Helper function to get active quests
async function getActiveQuests(userId) {
  // Get user's active quests
  const userQuests = await UserQuest.find({ 
    userId, 
    completed: false 
  })
  .select('questId progress')
  .limit(3)
  .lean();
  
  // Get quest details
  const questIds = userQuests.map(uq => uq.questId);
  
  const quests = await Quest.find({ 
    _id: { $in: questIds } 
  })
  .select('title description icon xpReward coinReward')
  .lean();
  
  // Combine quest details with progress
  return quests.map(quest => {
    const userQuest = userQuests.find(uq => uq.questId.toString() === quest._id.toString());
    return {
      ...quest,
      progress: userQuest ? userQuest.progress : 0
    };
  });
}

// Helper function to get upcoming deadlines
async function getUpcomingDeadlines(userId) {
  const now = new Date();
  
  // Get assignments due in the next 7 days
  const assignments = await Assignment.find({
    userId,
    status: 'pending',
    dueDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) }
  })
  .select('title subject dueDate priority')
  .sort({ dueDate: 1 })
  .limit(3)
  .lean();
  
  // Get exams in the next 7 days
  const exams = await Exam.find({
    userId,
    date: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) }
  })
  .select('title subject date difficulty')
  .sort({ date: 1 })
  .limit(3)
  .lean();
  
  // Combine and sort by date
  const deadlines = [
    ...assignments.map(a => ({
      ...a,
      type: 'assignment',
      dueDate: a.dueDate
    })),
    ...exams.map(e => ({
      ...e,
      type: 'exam',
      dueDate: e.date,
      priority: e.difficulty
    }))
  ];
  
  // Sort by date and limit to 3
  return deadlines
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);
}

// Helper function to get upcoming events
async function getUpcomingEvents() {
  const now = new Date();
  
  return Event.find({
    date: { $gte: now }
  })
  .select('title description location date')
  .sort({ date: 1 })
  .limit(3)
  .lean();
}

// Helper function to get leaderboard
async function getLeaderboard(currentUserId) {
  // Get top 5 users by level and XP
  const leaderboard = await User.find({})
    .select('name avatar level xp')
    .sort({ level: -1, xp: -1 })
    .limit(5)
    .lean();
  
  // Check if current user is in top 5
  const currentUserInTop = leaderboard.some(user => user._id.toString() === currentUserId);
  
  // If not, add current user to the list
  if (!currentUserInTop) {
    const currentUser = await User.findById(currentUserId)
      .select('name avatar level xp')
      .lean();
    
    if (currentUser) {
      // Add current user with a flag
      leaderboard.push({
        ...currentUser,
        isCurrentUser: true
      });
    }
  } else {
    // Mark the current user in the list
    leaderboard.forEach(user => {
      if (user._id.toString() === currentUserId) {
        user.isCurrentUser = true;
      }
    });
  }
  
  return leaderboard;
}

// Helper function to get recent activity
async function getRecentActivity(userId) {
  return Activity.find({ userId })
    .select('type title description icon xpEarned coinsEarned createdAt')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
}

module.exports = router;