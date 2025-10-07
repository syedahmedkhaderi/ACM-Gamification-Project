const express = require('express');
const { initializeData } = require('./data/store');

const userRoutes = require('./routes/user');
const assignmentsRoutes = require('./routes/assignments');
const examsRoutes = require('./routes/exams');
const questsRoutes = require('./routes/quests');
const studySessionsRoutes = require('./routes/studySessions');
const gradesRoutes = require('./routes/grades');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// API routes
app.use('/api', userRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/quests', questsRoutes);
app.use('/api/study-sessions', studySessionsRoutes);
app.use('/api/grades', gradesRoutes);

// initialize in-memory data once on boot
initializeData();

module.exports = app;


