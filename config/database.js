const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('⚠️  No MONGODB_URI found');
      console.log('📝 Please add a valid MongoDB connection string to continue');
      console.log('   You can get one from: https://www.mongodb.com/cloud/atlas');
      return false;
    }

    mongoURI = mongoURI.trim().replace(/^\*\s*/, '');

    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      console.error('❌ Invalid MongoDB URI format');
      console.log('📝 Please update MONGODB_URI with a valid connection string');
      return false;
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('📝 Please check your MONGODB_URI - it appears to be incomplete');
    console.log('   Expected format: mongodb+srv://user:password@cluster.mongodb.net/dbname');
    return false;
  }
};

module.exports = connectDB;
