const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  examTitle: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  gradePoints: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  semester: {
    type: String,
    default: 'Current'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
