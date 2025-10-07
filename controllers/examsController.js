const Exam = require('../models/Exam');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.list = async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.session.userId })
      .sort({ date: 1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const exam = new Exam({
      ...req.body,
      status: 'upcoming',
      xpReward: req.body.xpReward || 100,
      userId: req.session.userId
    });
    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.complete = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      userId: req.session.userId
    });
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    exam.status = 'completed';
    await exam.save();

    const user = await User.findById(req.session.userId);
    user.xp += exam.xpReward;
    user.coins += 25;
    user.level = user.calculateLevel();
    await user.save();

    await Activity.create({
      type: 'exam-complete',
      title: 'Exam Completed!',
      description: `Completed "${exam.title}"`,
      icon: '🎓',
      xpEarned: exam.xpReward,
      coinsEarned: 25,
      userId: req.session.userId
    });

    res.json({ exam, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
