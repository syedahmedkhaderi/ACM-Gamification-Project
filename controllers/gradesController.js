const Grade = require('../models/Grade');

function calculateGradePoints(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.0;
  if (percentage >= 70) return 2.0;
  if (percentage >= 60) return 1.0;
  return 0.0;
}

exports.list = async (req, res) => {
  try {
    const grades = await Grade.find({ userId: req.session.userId })
      .sort({ date: -1 });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const gradePoints = calculateGradePoints(req.body.score, req.body.maxScore || 100);

    const grade = new Grade({
      ...req.body,
      gradePoints,
      date: req.body.date || new Date(),
      semester: req.body.semester || 'Current',
      userId: req.session.userId
    });

    await grade.save();
    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const grade = await Grade.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });
    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.json({ message: 'Grade deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
