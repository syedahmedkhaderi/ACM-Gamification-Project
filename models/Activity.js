const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  icon: String,
  xpEarned: Number,
  coinsEarned: Number,
  badgeEarned: {
    name: String,
    icon: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
