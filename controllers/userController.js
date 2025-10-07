const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');
const Activity = require('../models/Activity');
const upload = require('../middleware/upload');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const [user, assignments, exams, grades] = await Promise.all([
      User.findById(userId).select('-password'),
      Assignment.find({ userId }),
      Exam.find({ userId }),
      Grade.find({ userId })
    ]);

    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const pendingAssignments = assignments.filter(a => a.status !== 'completed').length;
    const completedExams = exams.filter(e => e.status === 'completed').length;

    let gpa = 0;
    if (grades.length > 0) {
      const totalPoints = grades.reduce((sum, g) => sum + (g.gradePoints || 0), 0);
      gpa = (totalPoints / grades.length).toFixed(2);
    }

    res.json({
      user,
      completedAssignments,
      pendingAssignments,
      completedExams,
      totalExams: exams.length,
      gpa,
      totalGrades: grades.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { avatar: avatarUrl, avatarType: 'upload' },
      { new: true }
    ).select('-password');

    res.json({ avatar: avatarUrl, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const { avatar, avatarType } = req.body;
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { avatar, avatarType },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    const leaderboard = await Promise.all(users.map(async (user) => {
      const grades = await Grade.find({ userId: user._id });
      let gpa = 0;
      if (grades.length > 0) {
        const totalPoints = grades.reduce((sum, g) => sum + (g.gradePoints || 0), 0);
        gpa = parseFloat((totalPoints / grades.length).toFixed(2));
      }

      return {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        avatarType: user.avatarType,
        level: user.level,
        xp: user.xp,
        gpa,
        totalStudyMinutes: user.totalStudyMinutes,
        badgesEarned: user.badges?.length || 0,
        badges: user.badges
      };
    }));

    leaderboard.sort((a, b) => {
      if (b.gpa !== a.gpa) return b.gpa - a.gpa;
      if (b.totalStudyMinutes !== a.totalStudyMinutes) return b.totalStudyMinutes - a.totalStudyMinutes;
      return b.badgesEarned - a.badgesEarned;
    });

    res.json(leaderboard.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('inventory');
    res.json(user.inventory || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.useInventoryItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.session.userId);
    
    const item = user.inventory.find(i => i.itemId === itemId && !i.isUsed);
    if (!item) {
      return res.status(404).json({ error: 'Item not found or already used' });
    }

    item.isUsed = true;
    await user.save();

    res.json({ message: 'Item used successfully', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


