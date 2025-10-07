const store = require('../data/store');

exports.getUser = (req, res) => {
  res.json(store.user);
};

exports.updateUser = (req, res) => {
  Object.assign(store.user, req.body);
  res.json(store.user);
};

exports.getStats = (req, res) => {
  const completedAssignments = store.assignments.filter(a => a.status === 'completed').length;
  const pendingAssignments = store.assignments.filter(a => a.status !== 'completed').length;
  const completedExams = store.exams.filter(e => e.status === 'completed').length;

  let gpa = 0;
  if (store.grades.length > 0) {
    const totalPoints = store.grades.reduce((sum, g) => sum + (g.gradePoints || 0), 0);
    gpa = (totalPoints / store.grades.length).toFixed(2);
  }

  res.json({
    user: store.user,
    completedAssignments,
    pendingAssignments,
    completedExams,
    totalExams: store.exams.length,
    gpa,
    totalGrades: store.grades.length
  });
};

exports.getActivities = (req, res) => {
  const latest20 = store.activities
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);
  res.json(latest20);
};


