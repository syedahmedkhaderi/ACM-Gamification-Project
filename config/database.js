const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('⚠️  No MONGODB_URI found, using local MongoDB');
      mongoURI = 'mongodb://localhost:27017/questcraft';
    } else {
      mongoURI = mongoURI.trim();
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Please check your MONGODB_URI in Secrets');
    process.exit(1);
  }
};

module.exports = connectDB;
