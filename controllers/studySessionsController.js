const StudySession = require('../models/StudySession');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.list = async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.session.userId })
      .sort({ date: -1 })
      .limit(10);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const xpEarned = Math.floor(req.body.duration / 10);
    const coinsEarned = Math.floor(req.body.duration / 30);

    const session = new StudySession({
      ...req.body,
      xpEarned,
      coinsEarned,
      focusScore: req.body.focusScore || 100,
      date: new Date(),
      userId: req.session.userId
    });

    await session.save();

    const user = await User.findById(req.session.userId);
    user.xp += xpEarned;
    user.coins += coinsEarned;
    user.totalStudyMinutes += req.body.duration;
    user.level = user.calculateLevel();
    await user.save();

    await Activity.create({
      type: 'study-session',
      title: 'Study Session Complete!',
      description: `Studied ${req.body.subject} for ${req.body.duration} minutes`,
      icon: '📖',
      xpEarned: xpEarned,
      coinsEarned: coinsEarned,
      userId: req.session.userId
    });

    res.json({ session, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
