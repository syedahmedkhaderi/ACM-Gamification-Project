const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.list = async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.session.userId })
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      userId: req.session.userId
    });
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    assignment.status = 'completed';
    await assignment.save();

    const user = await User.findById(req.session.userId);
    user.xp += assignment.xpReward;
    user.coins += assignment.coinReward;
    user.totalTasksCompleted += 1;
    user.level = user.calculateLevel();
    await user.save();

    await Activity.create({
      type: 'assignment-complete',
      title: 'Assignment Completed!',
      description: `Completed "${assignment.title}"`,
      icon: '✅',
      xpEarned: assignment.xpReward,
      coinsEarned: assignment.coinReward,
      userId: req.session.userId
    });

    res.json({ assignment, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
