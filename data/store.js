// In-memory data store and helpers

let nextId = 1;
const generateId = () => String(nextId++);

let userData = {
  _id: '1',
  name: 'Syed Ahmed',
  xp: 350,
  level: 4,
  coins: 250,
  streak: 7,
  lastActiveDate: new Date(),
  achievements: [],
  unlockedItems: [],
  avatar: 'default',
  title: 'Software Engineer',
  totalTasksCompleted: 0,
  totalStudyMinutes: 0
};

let assignments = [];
let exams = [];
let quests = [];
let studySessions = [];
let grades = [];
let activities = [];

function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function addXP(amount) {
  userData.xp += amount;
  userData.level = calculateLevel(userData.xp);
}

function addCoins(amount) {
  userData.coins += amount;
}

function calculateGradePoints(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.0;
  if (percentage >= 70) return 2.0;
  if (percentage >= 60) return 1.0;
  return 0.0;
}

function initializeData() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextTwoWeeks = new Date(now);
  nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);


  assignments = [
    { _id: generateId(), title: 'Math 1030 Unit 3 HW', subject: 'MATH1030', description: 'Complete exercises 1-20', dueDate: tomorrow, priority: 'high', status: 'pending', xpReward: 60, coinReward: 10, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'Physics Pre-lab 4', subject: 'PHYS1020', description: 'Attempt Pre-lab Quiz before Going', dueDate: nextWeek, priority: 'medium', status: 'pending', xpReward: 80, coinReward: 15, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'COMM1010 Persuasive Writing Practice', subject: 'COMM1010', description: 'Prepare for Persuasive Writing', dueDate: nextWeek, priority: 'urgent', status: 'pending', xpReward: 100, coinReward: 20, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'EFFL1003 Voice-Recording', subject: 'EFFL1003', description: 'Complete EFFL Voice-Recording', dueDate: tomorrow, priority: 'medium', status: 'pending', xpReward: 50, coinReward: 10, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'INFS1101 Self-Assessment', subject: 'INFS1101', description: 'Complete INFS Self-Assessment', dueDate: nextTwoWeeks, priority: 'high', status: 'pending', xpReward: 90, coinReward: 20, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'Leetcode 51,58,72', subject: 'Leetcode', description: 'Solve Leetcode Q.no: 51, 58, 72', dueDate: nextWeek, priority: 'low', status: 'pending', xpReward: 40, coinReward: 8, userId: userData._id, createdAt: now }
];

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59);
  const endOfWeek = new Date(now);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  quests = [
    { _id: generateId(), title: 'Daily Grind', description: 'Complete 2 assignments today', type: 'daily', target: 2, progress: 0, xpReward: 50, coinReward: 15, expiresAt: endOfDay, status: 'active', userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'Study Marathon', description: 'Study for 5 hours this week', type: 'weekly', target: 300, progress: 0, xpReward: 150, coinReward: 50, expiresAt: endOfWeek, status: 'active', userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'Perfect Week', description: 'Complete all tasks this week', type: 'weekly', target: 5, progress: 0, xpReward: 200, coinReward: 75, expiresAt: endOfWeek, status: 'active', userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'Focus Sprint', description: 'Study 50 minutes today', type: 'daily', target: 50, progress: 0, xpReward: 60, coinReward: 20, expiresAt: endOfDay, status: 'active', userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'Exam Prep Push', description: 'Log 3 study sessions this week', type: 'weekly', target: 3, progress: 0, xpReward: 120, coinReward: 40, expiresAt: endOfWeek, status: 'active', userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'Assignment Streak', description: 'Complete assignments 3 days in a row', type: 'weekly', target: 3, progress: 0, xpReward: 140, coinReward: 50, expiresAt: endOfWeek, status: 'active', userId: userData._id, createdAt: now }
  ];

  studySessions = [];
  grades = [
    { _id: generateId(), examTitle: 'Algebra Quiz', subject: 'Mathematics', score: 85, maxScore: 100, gradePoints: calculateGradePoints(85, 100), date: now, semester: 'Current', userId: userData._id, createdAt: now },
    { _id: generateId(), examTitle: 'Chemistry Lab', subject: 'Chemistry', score: 92, maxScore: 100, gradePoints: calculateGradePoints(92, 100), date: now, semester: 'Current', userId: userData._id, createdAt: now },
    { _id: generateId(), examTitle: 'World History Test', subject: 'History', score: 78, maxScore: 100, gradePoints: calculateGradePoints(78, 100), date: now, semester: 'Current', userId: userData._id, createdAt: now },
    { _id: generateId(), examTitle: 'Literature Essay', subject: 'English', score: 88, maxScore: 100, gradePoints: calculateGradePoints(88, 100), date: now, semester: 'Current', userId: userData._id, createdAt: now },
    { _id: generateId(), examTitle: 'Physics Quiz', subject: 'Physics', score: 95, maxScore: 100, gradePoints: calculateGradePoints(95, 100), date: now, semester: 'Current', userId: userData._id, createdAt: now },
    { _id: generateId(), examTitle: 'Biology Midterm', subject: 'Biology', score: 68, maxScore: 100, gradePoints: calculateGradePoints(68, 100), date: now, semester: 'Current', userId: userData._id, createdAt: now }
  ];
  exams = [
    { _id: generateId(), title: 'MATH1030', subject: 'Mathematics', type: 'exam', date: nextWeek, difficulty: 'easy', studyHoursNeeded: 2, status: 'upcoming', xpReward: 150, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'PHYS1021', subject: 'Chemistry', type: 'exam', date: tomorrow, difficulty: 'hard', studyHoursNeeded: 13, status: 'upcoming', xpReward: 75, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'PHY1020', subject: 'Physics', type: 'exam', date: nextTwoWeeks, difficulty: 'medium', studyHoursNeeded: 8, status: 'upcoming', xpReward: 160, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'COMM1010', subject: 'English', type: 'test', date: nextWeek, difficulty: 'easy', studyHoursNeeded: 2, status: 'upcoming', xpReward: 60, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'EFFL1003', subject: 'General', type: 'test', date: nextWeek, difficulty: 'easy', studyHoursNeeded: 2, status: 'upcoming', xpReward: 110, userId: userData._id, createdAt: now },
    { _id: generateId(), title: 'INFS1101', subject: 'Computer Science', type: 'exam', date: tomorrow, difficulty: 'easy', studyHoursNeeded: 3, status: 'upcoming', xpReward: 80, userId: userData._id, createdAt: now },
];
  activities = [];
}

module.exports = {
  // data
  get user() { return userData; },
  set user(u) { userData = u; },
  get assignments() { return assignments; },
  get exams() { return exams; },
  get quests() { return quests; },
  get studySessions() { return studySessions; },
  get grades() { return grades; },
  get activities() { return activities; },
  // helpers
  generateId,
  calculateLevel,
  addXP,
  addCoins,
  calculateGradePoints,
  initializeData
};


