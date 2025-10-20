const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { paginateResults, optimizeProjection } = require('../utils/queryOptimizer');

exports.list = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || null;
    
    // Build query
    const query = { userId: req.session.userId };
    if (status) {
      query.status = status;
    }
    
    // Define projection (only return needed fields)
    const projection = optimizeProjection([
      'title', 'description', 'dueDate', 'status', 
      'subject', 'priority', 'xpReward', 'coinReward'
    ]);
    
    // Use optimized pagination
    const result = await paginateResults(Assignment, query, {
      page,
      limit,
      sort: { dueDate: 1 },
      projection
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

exports.create = async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      status: 'pending',
      xpReward: req.body.xpReward || 50,
      coinReward: req.body.coinReward || 10,
      userId: req.session.userId
    });
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.complete = async (req, res) => {
  try {
    // Use findOneAndUpdate to update in a single operation
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { $set: { status: 'completed' } },
      { new: true }
    );
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Use findByIdAndUpdate to update user in a single operation
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {
        $inc: {
          xp: assignment.xpReward,
          coins: assignment.coinReward,
          totalTasksCompleted: 1
        }
      },
      { new: true }
    );
    
    // Calculate level after update
    user.level = user.calculateLevel();
    await user.save();

    // Create activity record
    const activity = new Activity({
      type: 'assignment-complete',
      title: 'Assignment Completed!',
      description: `Completed "${assignment.title}"`,
      icon: '✅',
      xpEarned: assignment.xpReward,
      coinsEarned: assignment.coinReward,
      userId: req.session.userId
    });
    
    // Use Promise.all to run operations in parallel
    await Promise.all([
      activity.save(),
      // No need to save user again as we already did above
    ]);

    // Return only necessary user data
    const userData = {
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      totalTasksCompleted: user.totalTasksCompleted
    };

    res.json({ 
      assignment: {
        id: assignment._id,
        title: assignment.title,
        status: assignment.status,
        xpReward: assignment.xpReward,
        coinReward: assignment.coinReward
      }, 
      user: userData 
    });
  } catch (error) {
    console.error('Error completing assignment:', error);
    res.status(500).json({ error: 'Failed to complete assignment' });
  }
};
