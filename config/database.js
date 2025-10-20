const mongoose = require('mongoose');
const { createIndexes } = require('../utils/queryOptimizer');

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

    // Configure mongoose for better performance
    mongoose.set('strictQuery', false);
    
    // Connect with optimized settings
    await mongoose.connect(mongoURI, {
      // These options improve performance
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5,  // Maintain at least 5 socket connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      heartbeatFrequencyMS: 10000, // Check server health every 10 seconds
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Create indexes for better query performance
    await createIndexes(mongoose);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('📝 Please check your MONGODB_URI - it appears to be incomplete');
    console.log('   Expected format: mongodb+srv://user:password@cluster.mongodb.net/dbname');
    return false;
  }
};

module.exports = connectDB;
