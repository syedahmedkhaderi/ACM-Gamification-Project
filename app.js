require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const compression = require('compression');
const connectDB = require('./config/database');
const { initializeCache } = require('./config/cache');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const assignmentsRoutes = require('./routes/assignments');
const examsRoutes = require('./routes/exams');
const questsRoutes = require('./routes/quests');
const studySessionsRoutes = require('./routes/studySessions');
const gradesRoutes = require('./routes/grades');
const shopRoutes = require('./routes/shop');
const eventsRoutes = require('./routes/events');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Enable compression for all responses
app.use(compression());

// Connect to MongoDB
connectDB().then(connected => {
  if (connected) {
    console.log('🎉 App running with MongoDB database');
    
    // Initialize Redis cache if MongoDB is connected
    initializeCache();
  } else {
    console.log('⚠️  App running without database - please configure MongoDB');
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'questcraft-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
};

// Configure persistent session store when MONGODB_URI is provided
const mongoUriForSessions = process.env.MONGODB_URI;
if (mongoUriForSessions) {
  try {
    sessionConfig.store = MongoStore.create({
      mongoUrl: mongoUriForSessions,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24 * 7,
      autoRemove: 'native'
    });
    console.log('✅ Using MongoDB session store');
  } catch (e) {
    console.log('⚠️  Failed to configure MongoDB session store, falling back to memory:', e.message);
  }
} else {
  console.log('⚠️  No MONGODB_URI set; using in-memory session store');
}

app.use(session(sessionConfig));

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/quests', questsRoutes);
app.use('/api/study-sessions', studySessionsRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;


