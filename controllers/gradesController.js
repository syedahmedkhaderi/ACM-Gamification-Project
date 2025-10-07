const store = require('../data/store');

exports.list = (req, res) => {
  const sorted = [...store.grades].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sorted);
};

exports.create = (req, res) => {
  const gradePoints = store.calculateGradePoints(req.body.score, req.body.maxScore || 100);

  const grade = {
    _id: store.generateId(),
    ...req.body,
    gradePoints,
    date: req.body.date || new Date(),
    semester: req.body.semester || 'Current',
    userId: store.user._id,
    createdAt: new Date()
  };

  store.grades.push(grade);
  res.json(grade);
};

exports.remove = (req, res) => {
  const index = store.grades.findIndex(g => g._id === req.params.id);
  if (index !== -1) {
    store.grades.splice(index, 1);
    res.json({ message: 'Grade deleted' });
  } else {
    res.status(404).json({ error: 'Grade not found' });
  }
};


