const store = require('../data/store');

exports.list = (req, res) => {
  const sorted = [...store.studySessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  res.json(sorted);
};

exports.create = (req, res) => {
  const xpEarned = Math.floor(req.body.duration / 10);
  const coinEarned = Math.floor(req.body.duration / 30);

  const session = {
    _id: store.generateId(),
    ...req.body,
    xpEarned,
    coinEarned,
    focusScore: req.body.focusScore || 100,
    date: new Date(),
    userId: store.user._id,
    createdAt: new Date()
  };

  store.studySessions.push(session);

  store.addXP(xpEarned);
  store.addCoins(coinEarned);
  store.user.totalStudyMinutes += req.body.duration;

  store.activities.push({
    _id: store.generateId(),
    type: 'study-session',
    title: 'Study Session Complete!',
    description: `Studied ${req.body.subject} for ${req.body.duration} minutes`,
    icon: '📖',
    xpGained: xpEarned,
    coinsGained: coinEarned,
    userId: store.user._id,
    createdAt: new Date()
  });

  res.json({ session, user: store.user });
};


