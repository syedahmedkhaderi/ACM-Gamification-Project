const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');

// Function to create sample data for a new user
const createSampleDataForUser = async (userId, userName = 'User') => {
  const now = new Date();
  
  // Sample Assignments (6)
  const assignments = [
    {
      title: 'Limits WS 1',
      subject: 'MATH1030',
      description: 'Complete exercises 1-20 on Limits',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      priority: 'high',
      status: 'pending',
      xpReward: 50,
      coinReward: 10,
      userId
    },
    {
      title: 'Persuasive Paragraph',
      subject: 'COM1010',
      description: 'Write a 1500-word paragraph on the causes of World War II',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
      priority: 'medium',
      status: 'completed',
      xpReward: 75,
      coinReward: 15,
      userId
    },
    {
      title: 'Lab Report -5',
      subject: 'PHYS1021',
      description: 'Analyze the pendulum experiment data',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      priority: 'urgent',
      status: 'pending',
      xpReward: 60,
      coinReward: 12,
      userId
    },
    {
      title: 'Python Loops WS',
      subject: 'INFS1101',
      description: 'Complete exercises 1-20 on Python Loops',
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
      priority: 'low',
      status: 'completed',
      xpReward: 40,
      coinReward: 8,
      userId
    },
    {
      title: 'Note-Taking Exercise',
      subject: 'EFFL1003',
      description: 'Take notes on the lecture',
      dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days
      priority: 'medium',
      status: 'pending',
      xpReward: 55,
      coinReward: 11,
      userId
    },
    {
      title: 'DSA Leetcode #54',
      subject: 'INFS3201',
      description: 'Solve Leetcode problem 54',
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days
      priority: 'high',
      status: 'pending',
      xpReward: 100,
      coinReward: 20,
      userId
    }
  ];
  
  // Sample Exams (5)
  const exams = [
    {
      title: 'Mathematics Midterm',
      subject: 'MATH1030',
      type: 'exam',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      difficulty: 'hard',
      studyHoursNeeded: 8,
      status: 'upcoming',
      xpReward: 200,
      userId
    },
    {
      title: 'Communication Quiz',
      subject: 'COM1010',
      type: 'quiz',
      date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days
      difficulty: 'easy',
      studyHoursNeeded: 2,
      status: 'completed',
      xpReward: 50,
      userId
    },
    {
      title: 'Physics Final Exam',
      subject: 'PHYS1021',
      type: 'exam',
      date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
      difficulty: 'hard',
      studyHoursNeeded: 12,
      status: 'upcoming',
      xpReward: 300,
      userId
    },
    {
      title: 'Python Test',
      subject: 'INFS1101',
      type: 'test',
      date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days
      difficulty: 'medium',
      studyHoursNeeded: 4,
      status: 'upcoming',
      xpReward: 120,
      userId
    },
    {
      title: 'Note-Taking Quiz',
      subject: 'EFFL1003',
      type: 'quiz',
      date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      difficulty: 'medium',
      studyHoursNeeded: 1,
      status: 'completed',
      xpReward: 40,
      userId
    }
  ];
  
  // Sample Grades (5)
  const grades = [
    {
      examTitle: 'MATH1030 Final Exam',
      subject: 'MATH1030',
      score: 95,
      maxScore: 100,
      gradePoints: 4.0,
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'COM1010 Final Exam',
      subject: 'COM1010',
      score: 87,
      maxScore: 100,
      gradePoints: 3.7,
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'PHYS1021 Final Exam',
      subject: 'PHYS1021',
      score: 92,
      maxScore: 100,
      gradePoints: 3.9,
      date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'INFS1101 Final Exam',
      subject: 'INFS1101',
      score: 88,
      maxScore: 100,
      gradePoints: 3.8,
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'EFFL1003 Quiz',
      subject: 'EFFL1003',
      score: 90,
      maxScore: 100,
      gradePoints: 3.8,
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // yesterday
      semester: 'Fall 2024',
      userId
    }
  ];
  
  try {
    // Create the data
    await Assignment.insertMany(assignments);
    await Exam.insertMany(exams);
    await Grade.insertMany(grades);
    
    return {
      assignments: assignments.length,
      exams: exams.length,
      grades: grades.length
    };
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};

module.exports = {
  createSampleDataForUser
};