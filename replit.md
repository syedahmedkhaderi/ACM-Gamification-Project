# QuestCraft - Gamified Learning Platform v2.0

## Overview
QuestCraft is a gamified learning platform that transforms everyday study tasks into an engaging game. Students can complete assignments, schedule exams, log study sessions, record grades, and chase quests to earn XP, coins, and badges.

## Project Information
- **Type**: Full-stack web application with authentication
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Session-based with bcrypt password hashing
- **File Uploads**: Multer for avatar images
- **Port**: 5009

### Admin Account
```
Email: admin@questcraft.com
Password: admin123
```

### For Students
- ✅ Complete assignments and earn XP/coins
- ✅ Schedule and track exams
- ✅ Pomodoro study timer (25 min sessions)
- ✅ Track grades with automatic GPA calculation
- ✅ Complete quests to earn badges
- ✅ Purchase items from shop with coins
- ✅ Customize profile with emoji/uploaded avatar
- ✅ Showcase earned badges
- ✅ View leaderboard rankings
- ✅ See upcoming events


**Admin Capabilities:**
- Create/edit/delete quests
- Manage events
- Manage shop items
- Access all features
## Project Architecture

### Backend Structure
- **config/database.js** - MongoDB connection configuration
- **models/** - Mongoose schemas (User, Assignment, Exam, Grade, StudySession, Quest, UserQuest, Activity, Event, ShopItem)
- **middleware/** - Auth middleware (isAuthenticated, isAdmin) and file upload (multer)
- **controllers/** - Route handlers for all resources
- **routes/** - Express routers with authentication protection
- **scripts/** - Database initialization and admin creation scripts

### Frontend Structure
- **public/index.html** - Dashboard with leaderboard and events
- **public/pages/auth.html** - Login and registration page
- **public/pages/profile.html** - User profile with avatar, badges, inventory
- **public/pages/events.html** - Events listing (admin can add/edit)
- **public/pages/shop.html** - Shop with purchase confirmation
- **public/pages/quests.html** - Quests with badge rewards (admin-editable)
- **public/app.js** - Comprehensive frontend logic with auth handling
- **public/style.css** - Dark theme with blue/purple gradients

### Database Models
- **User** - Email, password, name, role (user/admin), XP, level, coins, streak, badges[], inventory[], avatar
- **Assignment** - Title, subject, description, dueDate, priority, status, XP/coin rewards
- **Exam** - Title, subject, type, date, difficulty, studyHoursNeeded, status, XP reward
- **Grade** - examTitle, subject, score, maxScore, gradePoints, date, semester
- **StudySession** - subject, duration, xpEarned, coinsEarned, date
- **Quest** - title, description, type (daily/weekly/special), target, badgeReward, expiresAt, isActive
- **UserQuest** - questId, userId, progress, status, completedAt
- **Activity** - userId, type, title, icon, xpEarned, coinsEarned, badgeEarned
- **Event** - title, description, date, location, type, icon, createdBy
- **ShopItem** - name, description, price, icon, type, effect, isAvailable

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check` - Check auth status

#### User & Profile
- `GET /api/user` - Get user profile (auth)
- `PUT /api/user` - Update user profile (auth)
- `GET /api/stats` - Get user stats (auth)
- `GET /api/activities` - Get activity feed (auth)
- `GET /api/leaderboard` - Get top 10 users (public)
- `GET /api/inventory` - Get user inventory (auth)
- `POST /api/inventory/:itemId/use` - Use inventory item (auth)
- `POST /api/avatar/upload` - Upload avatar image (auth)
- `PUT /api/avatar` - Update avatar (emoji) (auth)

#### Assignments (all auth required)
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/:id/complete` - Complete assignment

#### Exams (all auth required)
- `GET /api/exams` - List exams
- `POST /api/exams` - Create exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam
- `POST /api/exams/:id/complete` - Complete exam

#### Grades (all auth required)
- `GET /api/grades` - List grades
- `POST /api/grades` - Add grade
- `DELETE /api/grades/:id` - Delete grade

#### Study Sessions (all auth required)
- `GET /api/study-sessions` - List recent sessions
- `POST /api/study-sessions` - Log study session

#### Quests
- `GET /api/quests` - List quests with user progress (auth)
- `POST /api/quests` - Create quest (admin only)
- `PUT /api/quests/:id` - Update quest (admin only)
- `DELETE /api/quests/:id` - Delete quest (admin only)
- `POST /api/quests/:id/progress` - Update quest progress (auth)

#### Shop
- `GET /api/shop` - List available items (public)
- `POST /api/shop/:itemId/purchase` - Purchase item (auth)
- `POST /api/shop` - Create shop item (admin only)
- `PUT /api/shop/:id` - Update shop item (admin only)
- `DELETE /api/shop/:id` - Delete shop item (admin only)

#### Events
- `GET /api/events` - List all events (public)
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

## Key Features

### User Features
- User registration and login with session management
- Profile customization (name, title, avatar emoji/upload)
- Dashboard with stats, XP bar, activity feed, leaderboard, upcoming events
- Assignment management with priorities and rewards
- Exam scheduling and tracking
- Pomodoro study timer (25-minute sessions)
- Grade tracking with automatic GPA calculation
- Quest system with badge rewards
- Shop system with coin-based purchases
- Inventory management with item usage
- Badge showcase on profile
- Leaderboard ranking (GPA → study hours → badges)

### Admin Features
- Full quest management (create/edit/delete with badge configuration)
- Event management (create/edit/delete upcoming events)
- Shop item management
- Access to all user data

## Development

### Setup Database
```bash
# Make sure MONGODB_URI is configured in Secrets
npm run init-db    # Initialize with admin user and sample data
npm run create-admin  # Create admin user only
```

### Running Locally
```bash
npm install
npm start
```

### Default Credentials
- **Admin:** admin@questcraft.com / admin123
- **Users:** Register at /pages/auth.html

## User Preferences
- Dark theme with blue/purple gradients (#0f1419 background)
- UI must match existing design perfectly
- Badge-based quest rewards (not XP/coins for quests)
- Leaderboard priority: GPA > study hours > badges

## MongoDB Setup Notes
⚠️ **Current Issue**: The MONGODB_URI secret appears to have an incomplete cluster URL. 
Please update with a complete MongoDB Atlas connection string. See MONGODB_ISSUE.md for details.

```
questcraft/
├── config/
│   └── database.js          # MongoDB connection
├── models/                  # Mongoose schemas
│   ├── User.js
│   ├── Assignment.js
│   ├── Exam.js
│   ├── Grade.js
│   ├── StudySession.js
│   ├── Quest.js
│   ├── UserQuest.js
│   ├── Activity.js
│   ├── Event.js
│   └── ShopItem.js
├── controllers/             # Business logic
├── routes/                  # API endpoints
├── middleware/              # Auth & upload middleware
├── public/                  # Frontend
│   ├── pages/
│   │   ├── auth.html       # Login/Register
│   │   ├── profile.html    # User profile
│   │   ├── events.html     # Events
│   │   └── ...
│   ├── app.js              # Frontend logic
│   └── style.css           # Dark theme styles
└── scripts/
    ├── createAdmin.js      # Create admin user
    └── initializeData.js   # Full DB initialization
```
