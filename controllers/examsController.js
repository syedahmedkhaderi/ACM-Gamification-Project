const store = require('../data/store');

exports.list = (req, res) => {
  const sorted = [...store.exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json(sorted);
};

exports.create = (req, res) => {
  const exam = {
    _id: store.generateId(),
    ...req.body,
    status: 'upcoming',
    xpReward: req.body.xpReward || 100,
    userId: store.user._id,
    createdAt: new Date()
  };
  store.exams.push(exam);
  res.json(exam);
};

exports.update = (req, res) => {
  const index = store.exams.findIndex(e => e._id === req.params.id);
  if (index !== -1) {
    store.exams[index] = { ...store.exams[index], ...req.body };
    res.json(store.exams[index]);
  } else {
    res.status(404).json({ error: 'Exam not found' });
  }
};

exports.remove = (req, res) => {
  const index = store.exams.findIndex(e => e._id === req.params.id);
  if (index !== -1) {
    store.exams.splice(index, 1);
    res.json({ message: 'Exam deleted' });
  } else {
    res.status(404).json({ error: 'Exam not found' });
  }
};

exports.complete = (req, res) => {
  const exam = store.exams.find(e => e._id === req.params.id);
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }

  exam.status = 'completed';
  exam.completedAt = new Date();

  store.addXP(exam.xpReward);
  store.addCoins(25);

  store.activities.push({
    _id: store.generateId(),
    type: 'exam-complete',
    title: 'Exam Completed!',
    description: `Completed "${exam.title}"`,
    icon: '🎓',
    xpGained: exam.xpReward,
    coinsGained: 25,
    userId: store.user._id,
    createdAt: new Date()
  });

  res.json({ exam, user: store.user });
};


