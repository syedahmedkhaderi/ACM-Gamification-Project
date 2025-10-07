require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const assignmentsRoutes = require('./routes/assignments');
const examsRoutes = require('./routes/exams');
const questsRoutes = require('./routes/quests');
const studySessionsRoutes = require('./routes/studySessions');
const gradesRoutes = require('./routes/grades');
const shopRoutes = require('./routes/shop');
const eventsRoutes = require('./routes/events');

const app = express();

connectDB().then(connected => {
  if (connected) {
    console.log('🎉 App running with MongoDB database');
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

app.use(session(sessionConfig));
console.log('✅ Using in-memory session store');

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/quests', questsRoutes);
app.use('/api/study-sessions', studySessionsRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/events', eventsRoutes);

module.exports = app;


