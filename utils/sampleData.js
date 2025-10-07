const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');

// Function to create sample data for a new user
const createSampleDataForUser = async (userId, userName = 'User') => {
  const now = new Date();
  
  // Sample Assignments (6)
  const assignments = [
    {
      title: 'Math Homework Chapter 5',
      subject: 'Mathematics',
      description: 'Complete exercises 1-20 on quadratic equations',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      priority: 'high',
      status: 'pending',
      xpReward: 50,
      coinReward: 10,
      userId
    },
    {
      title: 'History Essay: WWII',
      subject: 'History',
      description: 'Write a 1500-word essay on the causes of World War II',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
      priority: 'medium',
      status: 'completed',
      xpReward: 75,
      coinReward: 15,
      userId
    },
    {
      title: 'Physics Lab Report',
      subject: 'Physics',
      description: 'Analyze the pendulum experiment data',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      priority: 'urgent',
      status: 'pending',
      xpReward: 60,
      coinReward: 12,
      userId
    },
    {
      title: 'English Literature Review',
      subject: 'English',
      description: 'Read and review "Pride and Prejudice" chapters 1-5',
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
      priority: 'low',
      status: 'completed',
      xpReward: 40,
      coinReward: 8,
      userId
    },
    {
      title: 'Chemistry Problem Set',
      subject: 'Chemistry',
      description: 'Solve stoichiometry problems 1-15',
      dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days
      priority: 'medium',
      status: 'pending',
      xpReward: 55,
      coinReward: 11,
      userId
    },
    {
      title: 'Computer Science Project',
      subject: 'Computer Science',
      description: 'Build a simple calculator using JavaScript',
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
      subject: 'Mathematics',
      type: 'exam',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      difficulty: 'hard',
      studyHoursNeeded: 8,
      status: 'upcoming',
      xpReward: 200,
      userId
    },
    {
      title: 'History Quiz',
      subject: 'History',
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
      subject: 'Physics',
      type: 'exam',
      date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
      difficulty: 'hard',
      studyHoursNeeded: 12,
      status: 'upcoming',
      xpReward: 300,
      userId
    },
    {
      title: 'English Literature Test',
      subject: 'English',
      type: 'test',
      date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days
      difficulty: 'medium',
      studyHoursNeeded: 4,
      status: 'upcoming',
      xpReward: 120,
      userId
    },
    {
      title: 'Chemistry Pop Quiz',
      subject: 'Chemistry',
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
      examTitle: 'Mathematics Quiz 1',
      subject: 'Mathematics',
      score: 95,
      maxScore: 100,
      gradePoints: 4.0,
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'History Essay 1',
      subject: 'History',
      score: 87,
      maxScore: 100,
      gradePoints: 3.7,
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'Physics Lab 1',
      subject: 'Physics',
      score: 92,
      maxScore: 100,
      gradePoints: 3.9,
      date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'English Literature Quiz',
      subject: 'English',
      score: 88,
      maxScore: 100,
      gradePoints: 3.8,
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'Chemistry Test 1',
      subject: 'Chemistry',
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