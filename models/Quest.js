const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'special'],
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  badgeReward: {
    id: String,
    name: String,
    icon: String,
    description: String
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Quest', questSchema);
