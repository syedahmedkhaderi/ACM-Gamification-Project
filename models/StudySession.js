const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  xpEarned: {
    type: Number,
    required: true
  },
  coinsEarned: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('StudySession', studySessionSchema);
