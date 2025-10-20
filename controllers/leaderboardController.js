const User = require('../models/User');
const { clearCache } = require('../config/cache');

// Get top 5 users for leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    // Find top 5 users sorted by XP (descending)
    const leaderboardUsers = await User.find({})
      .select('name xp level title avatar avatarType') // Only select needed fields
      .sort({ xp: -1, level: -1 }) // Sort by XP (descending), then level
      .limit(5) // Limit to top 5 users
      .lean(); // Convert to plain JavaScript objects for better performance
    
    // Format the response
    const formattedLeaderboard = leaderboardUsers.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.name,
      xp: user.xp,
      level: user.level,
      title: user.title || 'Scholar',
      avatar: user.avatar || '🎓',
      avatarType: user.avatarType || 'emoji',
      isCurrentUser: user._id.toString() === req.session.userId
    }));
    
    res.json(formattedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
};

// Refresh leaderboard cache
exports.refreshLeaderboard = async (req, res) => {
  try {
    // Clear leaderboard cache
    await clearCache('/api/leaderboard');
    
    res.json({ success: true, message: 'Leaderboard cache refreshed' });
  } catch (error) {
    console.error('Error refreshing leaderboard cache:', error);
    res.status(500).json({ error: 'Failed to refresh leaderboard cache' });
  }
};