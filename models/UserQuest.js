const mongoose = require('mongoose');

const userQuestSchema = new mongoose.Schema({
  questId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired'],
    default: 'active'
  },
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('UserQuest', userQuestSchema);
