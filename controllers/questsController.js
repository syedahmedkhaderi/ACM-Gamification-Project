const Quest = require('../models/Quest');
const UserQuest = require('../models/UserQuest');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.list = async (req, res) => {
  try {
    const activeQuests = await Quest.find({ isActive: true })
      .sort({ expiresAt: 1 });
    
    const userQuests = await UserQuest.find({ userId: req.session.userId })
      .populate('questId');
    
    const questsWithProgress = activeQuests.map(quest => {
      const userQuest = userQuests.find(uq => uq.questId && uq.questId._id.toString() === quest._id.toString());
      return {
        _id: quest._id,
        title: quest.title,
        description: quest.description,
        type: quest.type,
        target: quest.target,
        badgeReward: quest.badgeReward,
        expiresAt: quest.expiresAt,
        progress: userQuest ? userQuest.progress : 0,
        status: userQuest ? userQuest.status : 'active'
      };
    });
    
    res.json(questsWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create quests' });
    }

    const quest = new Quest({
      ...req.body,
      createdBy: req.session.userId
    });
    await quest.save();
    res.json(quest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update quests' });
    }

    const quest = await Quest.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    res.json(quest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete quests' });
    }

    const quest = await Quest.findByIdAndDelete(req.params.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    res.json({ message: 'Quest deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.progress = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    let userQuest = await UserQuest.findOne({
      questId: req.params.id,
      userId: req.session.userId
    });

    if (!userQuest) {
      userQuest = new UserQuest({
        questId: req.params.id,
        userId: req.session.userId,
        progress: 0,
        status: 'active'
      });
    }

    userQuest.progress += req.body.amount || 1;

    if (userQuest.progress >= quest.target && userQuest.status === 'active') {
      userQuest.status = 'completed';
      userQuest.completedAt = new Date();

      const user = await User.findById(req.session.userId);
      
      if (quest.badgeReward && quest.badgeReward.id) {
        const badgeExists = user.badges.some(b => b.badgeId === quest.badgeReward.id);
        if (!badgeExists) {
          user.badges.push({
            badgeId: quest.badgeReward.id,
            name: quest.badgeReward.name,
            icon: quest.badgeReward.icon,
            earnedAt: new Date()
          });
          await user.save();

          await Activity.create({
            type: 'quest-complete',
            title: 'Quest Completed!',
            description: `Completed "${quest.title}"`,
            icon: '🎯',
            badgeEarned: {
              name: quest.badgeReward.name,
              icon: quest.badgeReward.icon
            },
            userId: req.session.userId
          });
        }
      }
    }

    await userQuest.save();

    const questWithProgress = {
      _id: quest._id,
      title: quest.title,
      description: quest.description,
      type: quest.type,
      target: quest.target,
      badgeReward: quest.badgeReward,
      expiresAt: quest.expiresAt,
      progress: userQuest.progress,
      status: userQuest.status
    };

    const user = await User.findById(req.session.userId).select('-password');
    res.json({ quest: questWithProgress, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
