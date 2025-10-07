const store = require('../data/store');

exports.list = (req, res) => {
  const sorted = [...store.assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  res.json(sorted);
};

exports.create = (req, res) => {
  const assignment = {
    _id: store.generateId(),
    ...req.body,
    status: 'pending',
    xpReward: req.body.xpReward || 50,
    coinReward: req.body.coinReward || 10,
    userId: store.user._id,
    createdAt: new Date()
  };
  store.assignments.push(assignment);
  res.json(assignment);
};

exports.update = (req, res) => {
  const index = store.assignments.findIndex(a => a._id === req.params.id);
  if (index !== -1) {
    store.assignments[index] = { ...store.assignments[index], ...req.body };
    res.json(store.assignments[index]);
  } else {
    res.status(404).json({ error: 'Assignment not found' });
  }
};

exports.remove = (req, res) => {
  const index = store.assignments.findIndex(a => a._id === req.params.id);
  if (index !== -1) {
    store.assignments.splice(index, 1);
    res.json({ message: 'Assignment deleted' });
  } else {
    res.status(404).json({ error: 'Assignment not found' });
  }
};

exports.complete = (req, res) => {
  const assignment = store.assignments.find(a => a._id === req.params.id);
  if (!assignment) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  assignment.status = 'completed';
  assignment.completedAt = new Date();

  store.addXP(assignment.xpReward);
  store.addCoins(assignment.coinReward);
  store.user.totalTasksCompleted += 1;

  store.activities.push({
    _id: store.generateId(),
    type: 'assignment-complete',
    title: 'Assignment Completed!',
    description: `Completed "${assignment.title}"`,
    icon: '✅',
    xpGained: assignment.xpReward,
    coinsGained: assignment.coinReward,
    userId: store.user._id,
    createdAt: new Date()
  });

  res.json({ assignment, user: store.user });
};


