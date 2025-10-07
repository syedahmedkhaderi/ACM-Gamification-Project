require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Quest = require('../models/Quest');
const ShopItem = require('../models/ShopItem');

const initializeData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI?.trim();
    if (!mongoURI || !mongoURI.startsWith('mongodb')) {
      console.log('❌ Invalid or missing MONGODB_URI. Skipping initialization.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@questcraft.com' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@questcraft.com',
        password: 'admin123',
        name: 'Admin',
        role: 'admin',
        xp: 1000,
        level: 10,
        coins: 5000,
        title: 'Quest Master'
      });
      await admin.save();
      console.log('✅ Admin user created (admin@questcraft.com / admin123)');
    }

    const questCount = await Quest.countDocuments();
    if (questCount === 0) {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59);
      const endOfWeek = new Date(now);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const quests = [
        {
          title: 'First Steps',
          description: 'Complete your first 2 assignments',
          type: 'daily',
          target: 2,
          badgeReward: {
            id: 'badge_first_steps',
            name: 'First Steps',
            icon: '🎯',
            description: 'Completed your first assignments'
          },
          expiresAt: endOfDay,
          isActive: true
        },
        {
          title: 'Study Master',
          description: 'Study for 5 hours this week',
          type: 'weekly',
          target: 300,
          badgeReward: {
            id: 'badge_study_master',
            name: 'Study Master',
            icon: '📚',
            description: 'Dedicated learner - studied 5 hours in a week'
          },
          expiresAt: endOfWeek,
          isActive: true
        },
        {
          title: 'Perfect Score',
          description: 'Achieve a perfect GPA of 4.0',
          type: 'special',
          target: 1,
          badgeReward: {
            id: 'badge_perfect_score',
            name: 'Perfect Score',
            icon: '🏆',
            description: 'Academic excellence - achieved 4.0 GPA'
          },
          isActive: true
        }
      ];

      await Quest.insertMany(quests);
      console.log('✅ Sample quests created');
    }

    const shopCount = await ShopItem.countDocuments();
    if (shopCount === 0) {
      const shopItems = [
        {
          name: 'Time Boost',
          description: 'Doubles your XP for 1 hour',
          price: 100,
          icon: '⚡',
          type: 'boost',
          effect: 'xp_double_1h',
          isAvailable: true
        },
        {
          name: 'Dark Mode Theme',
          description: 'Unlock dark purple theme',
          price: 250,
          icon: '🎨',
          type: 'theme',
          effect: 'theme_dark_purple',
          isAvailable: true
        },
        {
          name: 'Study Shield',
          description: 'Protects your streak for 1 day',
          price: 150,
          icon: '🛡️',
          type: 'other',
          effect: 'streak_protect',
          isAvailable: true
        },
        {
          name: 'Golden Trophy',
          description: 'Cosmetic trophy for your profile',
          price: 500,
          icon: '🏆',
          type: 'cosmetic',
          effect: 'cosmetic_trophy',
          isAvailable: true
        }
      ];

      await ShopItem.insertMany(shopItems);
      console.log('✅ Shop items created');
    }

    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing data:', error.message);
    process.exit(1);
  }
};

initializeData();
