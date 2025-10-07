require('dotenv').config()
const mongoose = require('mongoose');
const User = require('../models/User');
const Quest = require('../models/Quest');
const ShopItem = require('../models/ShopItem');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const Grade = require('../models/Grade');
const Event = require('../models/Event');

// Function to create sample data for a user
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
    }
  ];
  
  // Sample Exams (5)
  const exams = [
    {
      title: 'MATH1030 Midterm',
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
      title: 'COM1010 Quiz',
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
      title: 'PHYS1021 Final Exam',
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
      title: 'INFS1101 Test',
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
      title: 'EFFL1003 Quiz',
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
      score: 100,
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
      score: 100,
      maxScore: 100,
      gradePoints: 3.8,
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      semester: 'Fall 2024',
      userId
    },
    {
      examTitle: 'EFFL1003 Quiz',
      subject: 'EFFL1003',
      score: 59,
      maxScore: 100,
      gradePoints: 3.8,
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // yesterday
      semester: 'Fall 2024',
      userId
    }
  ];
  
  // Create the data
  await Assignment.insertMany(assignments);
  await Exam.insertMany(exams);
  await Grade.insertMany(grades);
  
  return {
    assignments: assignments.length,
    exams: exams.length,
    grades: grades.length
  };
};

// Function to create sample events (admin only)
const createSampleEvents = async (adminId) => {
  const now = new Date();
  
  const events = [
    {
      title: 'ACM Hackathon',
      description: 'Register for the ACM Hackathon through Outlook',
      date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
      location: 'Main Auditorium',
      type: 'competition',
      icon: '🔬',
      createdBy: adminId
    },
    {
      title: 'ACM Tech Talk',
      description: 'Learn about new web development frameworks from ACM Proffesionals!',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      location: 'Main Auditorium',
      type: 'seminar',
      icon: '📚',
      createdBy: adminId
    },
    {
      title: 'ACM Career Guidance Seminar',
      description: 'Explore different career paths and opportunities',
      date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days
      location: 'Gymnasium',
      type: 'seminar',
      icon: '💼',
      createdBy: adminId
    },
    {
      title: 'ACM Project Proposal Meeting',
      description: 'ACM Project Proposal Meeting - all welcome!',
      date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      location: 'Various Classrooms',
      type: 'deadline',
      icon: '⏰',
      createdBy: adminId
    },
    {
      title: 'ACM StudentBoard Meeting',
      description: 'Monthly ACM StudentBoard meeting - all welcome!',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      location: 'Room 201',
      type: 'other',
      icon: '🏛️',
      createdBy: adminId
    }
  ];
  
  await Event.insertMany(events);
  return events.length;
};

const initializeData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI?.trim();
    if (!mongoURI || !mongoURI.startsWith('mongodb')) {
      console.log('❌ Invalid or missing MONGODB_URI. Skipping initialization.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    let admin = await User.findOne({ email: 'admin@acmlearning.com' });
    let isNewAdmin = false;
    
    if (!admin) {
      admin = new User({
        email: 'admin@acmlearning.com',
        password: 'admin123',
        name: 'Admin',
        role: 'admin',
        xp: 10000,
        level: 'Max',
        coins: 1000000,
        title: 'ACM Administrator'
      });
      await admin.save();
      isNewAdmin = true;
      console.log('✅ Admin user created (admin@acmlearning.com / admin123)');
    }
    
    // Create sample data for admin user if new or if no existing data
    const existingAssignments = await Assignment.find({ userId: admin._id });
    if (isNewAdmin || existingAssignments.length === 0) {
      const sampleData = await createSampleDataForUser(admin._id, 'Admin');
      console.log(`✅ Sample data created for admin: ${sampleData.assignments} assignments, ${sampleData.exams} exams, ${sampleData.grades} grades`);
    }
    
    // Create sample events if none exist
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      const eventCount = await createSampleEvents(admin._id);
      console.log(`✅ ${eventCount} sample events created`);
    }

    const questCount = await Quest.countDocuments();
    if (questCount === 0) {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59);
      const endOfWeek = new Date(now);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      const endOfMonth = new Date(now);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      const quests = [
        {
          title: '30,000 Steps!',
          description: 'Reach 30,000 steps in one day',
          type: 'daily',
          target: 2,
          badgeReward: {
            id: 'badge_reach_30000_steps',
            name: 'Reach 30,000 Steps',
            icon: '🎯',
            description: 'Reached 30,000 steps in one day'
          },
          expiresAt: endOfDay,
          isActive: true
        },
        {
          title: 'Study Master',
          description: 'Study for 25 hours this week',
          type: 'weekly',
          target: 300,
          badgeReward: {
            id: 'badge_study_master',
            name: 'Study Master',
            icon: '📚',
            description: 'Dedicated learner - studied 5 hours in a week'
          },
          expiresAt: endOfWeek,
          isActive: true
        },
        {
          title: 'Perfect Score',
          description: 'Achieve a perfect GPA of 4.0',
          type: 'special',
          target: 1,
          badgeReward: {
            id: 'badge_perfect_score',
            name: 'Perfect Score',
            icon: '🏆',
            description: 'Academic excellence - achieved 4.0 GPA'
          },
          isActive: true
        },
        {
          title: 'ACM Scholar',
          description: 'Contribute to 5 ACM projects',
          type: 'weekly',
          target: 5,
          badgeReward: {
            id: 'badge_acm_scholar',
            name: 'ACM Scholar',
            icon: '🎓',
            description: 'Contributed to 5 ACM projects'
          },
          expiresAt: endOfWeek,
          isActive: true
        },
        {
          title: 'Hackathon Winner',
          description: 'Win a hackathon Conducted by ACM',
          type: 'special',
          target: 1,
          badgeReward: {
            id: 'badge_hackathon_winner',
            name: 'Hackathon Winner',
            icon: '⭐',
            description: 'Won a hackathon Conducted by ACM'
          },
          expiresAt: endOfMonth,
          isActive: true
        },
        {
          title: 'Event Participant',
          description: 'Attend 3 ACM events',
          type: 'weekly',
          target: 3,
          badgeReward: {
            id: 'badge_event_participant',
            name: 'Event Participant',
            icon: '🎉',
            description: 'Active ACM community member'
          },
          expiresAt: endOfWeek,
          isActive: true
        },
        {
          title: 'Code Master',
          description: 'Complete 10 coding assignments',
          type: 'weekly',
          target: 10,
          badgeReward: {
            id: 'badge_code_master',
            name: 'Code Master',
            icon: '💻',
            description: 'Programming excellence'
          },
          expiresAt: endOfWeek,
          isActive: true
        },
        {
          title: 'Early Bird',
          description: 'Complete 3 assignments before deadline',
          type: 'daily',
          target: 3,
          badgeReward: {
            id: 'badge_early_bird',
            name: 'Early Bird',
            icon: '🐦',
            description: 'Always ahead of schedule'
          },
          expiresAt: endOfDay,
          isActive: true
        },
        {
          title: 'ACM Contributor',
          description: 'Participate in 5+ group projects',
          type: 'weekly',
          target: 2,
          badgeReward: {
            id: 'badge_acm_contributor',
            name: 'ACM Contributor',
            icon: '🤝',
            description: 'Participated in 5+ group projects'
          },
          expiresAt: endOfWeek,
          isActive: true
        },
        {
          title: 'Portfolioist',
          description: 'Build a portfolio website',
          type: 'weekly',
          target: 600,
          badgeReward: {
            id: 'badge_built_a_portfolio_website',
            name: 'Built a Portfolio Website',
            icon: '📖',
            description: 'Built a portfolio website'
          },
          expiresAt: endOfWeek,
          isActive: true
        }
      ];

      await Quest.insertMany(quests);
      console.log('✅ Sample quests created');
    }

    const shopCount = await ShopItem.countDocuments();
    if (shopCount === 0) {
      const shopItems = [
        {
          name: 'Time Boost',
          description: 'Doubles your XP for 1 hour',
          price: 100,
          icon: '⚡',
          type: 'boost',
          effect: 'xp_double_1h',
          isAvailable: true
        },
        {
          name: 'Light Mode Theme',
          description: 'Unlock Light Mode theme',
          price: 250,
          icon: '🎨',
          type: 'theme',
          effect: 'theme_light_mode',
          isAvailable: true
        },
        {
          name: 'Study Shield',
          description: 'Protects your streak for 1 day',
          price: 150,
          icon: '🛡️',
          type: 'other',
          effect: 'streak_protect',
          isAvailable: true
        },
        {
          name: 'Golden Trophy',
          description: 'Cosmetic trophy for your profile',
          price: 500,
          icon: '🏆',
          type: 'cosmetic',
          effect: 'cosmetic_trophy',
          isAvailable: true
        }
      ];

      await ShopItem.insertMany(shopItems);
      console.log('✅ Shop items created');
    }

    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing data:', error.message);
    process.exit(1);
  }
};

initializeData();
