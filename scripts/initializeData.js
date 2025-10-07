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
      title: 'Science Fair Registration',
      description: 'Register for the annual science fair competition',
      date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
      location: 'Main Auditorium',
      type: 'competition',
      icon: '🔬',
      createdBy: adminId
    },
    {
      title: 'Study Skills Workshop',
      description: 'Learn effective study techniques and time management',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      location: 'Library Conference Room',
      type: 'workshop',
      icon: '📚',
      createdBy: adminId
    },
    {
      title: 'Career Guidance Seminar',
      description: 'Explore different career paths and opportunities',
      date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days
      location: 'Gymnasium',
      type: 'seminar',
      icon: '💼',
      createdBy: adminId
    },
    {
      title: 'Final Exam Period',
      description: 'Final examinations for all courses',
      date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      location: 'Various Classrooms',
      type: 'deadline',
      icon: '⏰',
      createdBy: adminId
    },
    {
      title: 'Student Council Meeting',
      description: 'Monthly student council meeting - all welcome',
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

    let admin = await User.findOne({ email: 'admin@questcraft.com' });
    let isNewAdmin = false;
    
    if (!admin) {
      admin = new User({
        email: 'admin@questcraft.com',
        password: 'admin123',
        name: 'Admin',
        role: 'admin',
        xp: 1000,
        level: 10,
        coins: 5000,
        title: 'Quest Master'
      });
      await admin.save();
      isNewAdmin = true;
      console.log('✅ Admin user created (admin@questcraft.com / admin123)');
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
          title: 'First Steps',
          description: 'Complete your first 2 assignments',
          type: 'daily',
          target: 2,
          badgeReward: {
            id: 'badge_first_steps',
            name: 'First Steps',
            icon: '🎯',
            description: 'Completed your first assignments'
          },
          expiresAt: endOfDay,
          isActive: true
        },
        {
          title: 'Study Master',
          description: 'Study for 5 hours this week',
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
          title: 'Exam Ace',
          description: 'Complete 5 exams with high scores',
          type: 'weekly',
          target: 5,
          badgeReward: {
            id: 'badge_exam_ace',
            name: 'Exam Ace',
            icon: '🎓',
            description: 'Mastered multiple exams'
          },
          expiresAt: endOfWeek,
          isActive: true
        },
        {
          title: 'Grade Champion',
          description: 'Maintain above 3.5 GPA',
          type: 'special',
          target: 1,
          badgeReward: {
            id: 'badge_grade_champion',
            name: 'Grade Champion',
            icon: '⭐',
            description: 'Consistent academic excellence'
          },
          expiresAt: endOfMonth,
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
          name: 'Dark Mode Theme',
          description: 'Unlock dark purple theme',
          price: 250,
          icon: '🎨',
          type: 'theme',
          effect: 'theme_dark_purple',
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
