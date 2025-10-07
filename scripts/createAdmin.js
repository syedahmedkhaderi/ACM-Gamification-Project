require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI?.trim() || 'mongodb://localhost:27017/questcraft';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@acmlearning.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      email: 'admin@acmlearning.com',
      password: 'admin123',
      name: 'Admin',
      role: 'admin',
      xp: 10000,
      level: 'Max',
      coins: 1000000,
      title: 'ACM Administrator'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@acmlearning.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdminUser();
