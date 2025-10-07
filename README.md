# 🎓 ACM Learning - Gamified Student Management System

A comprehensive web application that gamifies the academic experience for students, featuring assignment tracking, study sessions, quests, achievements, and a virtual shop system. Built for the Association for Computing Machinery (ACM) to enhance student engagement and academic performance.

## 🌟 Features and Gamification Mechanics

### XP System
- **Assignment Completion**: 50-200 XP based on priority
- **Study Sessions**: 1 XP per minute of study time
- **Exam Completion**: 50-300 XP based on difficulty
- **Quest Completion**: Variable XP based on quest type

### Leveling System
- **Level Calculation**: `Math.floor(xp / 100) + 1`
- **Progressive Rewards**: Higher levels unlock better rewards
- **Visual Feedback**: XP bars and level indicators

### Currency System
- **Coin Earning**: 10-50 coins per completed task
- **Shop Economy**: Balanced pricing for virtual items
- **Reward Scaling**: Higher rewards for more difficult tasks

### 📚 Academic Management
- **Assignment Tracking**: Create, manage, and complete assignments with XP rewards
- **Exam Scheduling**: Schedule and track upcoming exams with study hour requirements
- **Grade Management**: Record and track academic performance with GPA calculation
- **Study Sessions**: Pomodoro timer with session logging and XP rewards
- **Event Management**: ACM events, seminars, and deadlines

### 🛒 Virtual Shop
- **Boost Items**: XP multipliers, study shields, and time boosts
- **Themes**: Unlock different visual themes
- **Cosmetics**: Avatars, titles, and profile customizations
- **Admin Management**: Create and manage shop items

### 👥 User Management
- **Student Accounts**: Registration and profile management
- **Admin Panel**: Administrative controls for content management
- **Authentication**: Secure login/logout with session management
- **Profile Customization**: Avatars, titles, and personal information

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js with RESTful API design
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Session-based authentication with bcrypt password hashing
- **Session Storage**: MongoDB-backed sessions with connect-mongo
- **File Structure**:
  ```
  ├── config/          # Database configuration
  ├── controllers/      # Business logic controllers
  ├── middleware/       # Authentication & upload middleware
  ├── models/          # MongoDB schemas
  ├── routes/          # API route definitions
  ├── scripts/         # Database initialization scripts
  └── utils/           # Utility functions
  ```

### Frontend (Vanilla JavaScript)
- **Architecture**: Multi Page Application (SPA) with vanilla JavaScript
- **Styling**: Custom CSS with CSS variables and modern design
- **Responsive Design**: Mobile-first approach with responsive navigation
- **File Structure**:
  ```
  public/
  ├── index.html       # Main dashboard
  ├── app.js          # Frontend JavaScript
  ├── style.css       # Global styles
  └── pages/          # Individual page components
      ├── assignments.html
      ├── exams.html
      ├── study.html
      ├── grades.html
      ├── quests.html
      ├── shop.html
      ├── events.html
      ├── profile.html
      └── auth.html
  ```

## 🗄️ Database Schema

### Core Models
- **User**: Student profiles with XP, coins, level, badges, inventory
- **Assignment**: Academic assignments with due dates and rewards
- **Exam**: Scheduled exams with difficulty and study requirements
- **Grade**: Academic performance records with GPA calculation
- **StudySession**: Study time tracking with XP rewards
- **Quest**: Gamified challenges with badge rewards
- **ShopItem**: Virtual store items for purchase
- **Event**: ACM events and academic deadlines
- **Activity**: User activity feed and notifications
- **UserQuest**: Quest progress tracking

### Key Relationships
- Users have many Assignments, Exams, Grades, StudySessions
- Users can have many Quests (many-to-many through UserQuest)
- Users can purchase many ShopItems (stored in inventory)
- Activities track all user actions for the activity feed

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AMC-Gamification-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amc-learning
   SESSION_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   # Initialize sample data
   npm run init-db
   
   # Create admin user (optional)
   npm run create-admin
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Open your browser to `http://localhost:5000` (or `http://127.0.0.1:5000`)
   - Default admin credentials: `admin@acmlearning.com` / `admin123`

## 📱 Usage Guide

### For Students
1. **Registration**: Create an account with email and password
2. **Dashboard**: View your progress, XP, coins, and upcoming deadlines
3. **Assignments**: Create and track academic assignments
4. **Study Sessions**: Use the Pomodoro timer to log study time
5. **Quests**: Complete daily and weekly challenges for rewards
6. **Shop**: Spend coins on boosts, themes, and cosmetics
7. **Profile**: Customize your avatar, title, and view achievements

### For Administrators
1. **Content Management**: Create quests, shop items, and events
2. **User Oversight**: Monitor student progress and engagement
3. **System Configuration**: Manage rewards, XP values, and shop items

## 🔮 Future Enhancements

### Planned Features
- **Mobile App**: React Native or Flutter mobile application
- **Advanced Analytics**: Detailed progress tracking and insights
- **AI Integration**: Personalized study recommendations
- **Advanced Gamification**: More quest types and achievement systems

### Technical Improvements
- **API Versioning**: Versioned API endpoints
- **Caching**: Redis integration for improved performance
- **Testing**: Comprehensive test suite with Jest
- **Monitoring**: Application performance monitoring

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **JavaScript**: ES6+ with consistent formatting
- **CSS**: Use CSS variables and mobile-first approach
- **API**: Follow RESTful conventions
- **Database**: Use Mongoose schemas with validation

## 📄 License

This project is licensed under the ISC License. See the package.json file for details.

---

**ACM Learning** - Gamifying Education for Better Student Engagement 🎓✨
