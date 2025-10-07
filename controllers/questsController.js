const store = require('../data/store');

exports.list = (req, res) => {
  const sorted = [...store.quests].sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
  res.json(sorted);
};

exports.progress = (req, res) => {
  const quest = store.quests.find(q => q._id === req.params.id);
  if (!quest) {
    return res.status(404).json({ error: 'Quest not found' });
  }

  quest.progress += req.body.amount || 1;

  if (quest.progress >= quest.target && quest.status === 'active') {
    quest.status = 'completed';
    store.addXP(quest.xpReward);
    store.addCoins(quest.coinReward);

    store.activities.push({
      _id: store.generateId(),
      type: 'quest-complete',
      title: 'Quest Completed!',
      description: `Completed "${quest.title}"`,
      icon: '🎯',
      xpGained: quest.xpReward,
      coinsGained: quest.coinReward,
      userId: store.user._id,
      createdAt: new Date()
    });
  }

  res.json({ quest, user: store.user });
};


