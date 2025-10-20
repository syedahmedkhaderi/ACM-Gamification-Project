const express = require('express');
const controller = require('../controllers/leaderboardController');
const { isAuthenticated } = require('../middleware/auth');
const { applyCache } = require('../middleware/cache');
const router = express.Router();

// Get leaderboard data (cached for 5 minutes)
router.get('/', isAuthenticated, applyCache(300), controller.getLeaderboard);

// Refresh leaderboard cache (admin only)
router.post('/refresh', isAuthenticated, (req, res, next) => {
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}, controller.refreshLeaderboard);

module.exports = router;