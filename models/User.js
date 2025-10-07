const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  coins: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  achievements: [{
    type: String
  }],
  badges: [{
    badgeId: String,
    name: String,
    icon: String,
    earnedAt: Date
  }],
  inventory: [{
    itemId: String,
    name: String,
    type: String,
    icon: String,
    purchasedAt: Date,
    isUsed: Boolean
  }],
  avatar: {
    type: String,
    default: '🎓'
  },
  avatarType: {
    type: String,
    enum: ['emoji', 'upload'],
    default: 'emoji'
  },
  title: {
    type: String,
    default: 'Scholar'
  },
  totalTasksCompleted: {
    type: Number,
    default: 0
  },
  totalStudyMinutes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.calculateLevel = function() {
  return Math.floor(this.xp / 100) + 1;
};

module.exports = mongoose.model('User', userSchema);
