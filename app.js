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

const app = express();

connectDB();

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

if (process.env.MONGODB_URI) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  });
}

app.use(session(sessionConfig));

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/quests', questsRoutes);
app.use('/api/study-sessions', studySessionsRoutes);
app.use('/api/grades', gradesRoutes);

module.exports = app;


