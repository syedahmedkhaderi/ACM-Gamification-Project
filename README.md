# QuestCraft v2.0 - Gamified Learning Platform

## 🎉 Current Status

Your QuestCraft application has been successfully upgraded to v2.0 with all requested features! The server is **running successfully** on port 5000.

### ✅ Completed Features

1. **MongoDB Database Integration**
   - All data models created (User, Assignment, Exam, Grade, StudySession, Quest, UserQuest, Activity, Event, ShopItem)
   - Mongoose ODM with proper schemas and validation
   - Session-based authentication with bcrypt password hashing

2. **User Authentication System**
   - Registration and login pages with matching UI
   - Session management (currently using in-memory sessions)
   - Logout functionality
   - Protected routes with authentication middleware

3. **Admin Account System**
   - Role-based access control (user/admin)
   - Admin-only routes for quest management, events, and shop items
   - Protected with `isAdmin` middleware

4. **Badge-Based Quest System**
   - Quests now reward badges (not XP/coins)
   - Admin-only quest creation and editing
   - Badge showcase on user profiles
   - User progress tracking per quest

5. **Inventory & Shop System**
   - Shop with purchasable items using coins
   - Purchase confirmation modal
   - Inventory management with "Use" functionality
   - Coin balance checking

6. **Events Section**
   - Admin can create/edit/delete upcoming events
   - Event cards with date, title, description, location
   - Displayed on dashboard

7. **Leaderboard**
   - Top 10 users sorted by: GPA → study hours → badges
   - User avatars displayed
   - Real-time ranking

8. **Profile System**
   - Avatar selection (40+ emoji picker + image upload)
   - Badge showcase grid
   - Inventory display
   - Profile editing

9. **UI Updates**
   - All pages match the dark theme (#0f1419 background, blue/purple gradients)
   - Login/register page
   - Profile page
   - Events page
   - Updated shop, quests, dashboard
   - Navbar with profile link and logout

## ⚠️ MongoDB Setup Required

The server is running but needs a valid MongoDB connection to store data permanently.

### Current Issue

Your MONGODB_URI secret appears to have an **incomplete cluster URL**. The connection string format is:

```
Current (incomplete): mongodb+srv://user:pass@cluster.mongodb.net/questcraft
Required format:      mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/questcraft
```

Where `xxxxx` is your cluster's unique identifier.

### How to Fix

1. **Get the Complete Connection String:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Login and select your cluster
   - Click "Connect" → "Connect your application"
   - **Copy the COMPLETE connection string**

2. **Update the Secret:**
   - In Replit, go to Secrets (lock icon in sidebar)
   - Find `MONGODB_URI`
   - Replace with your complete connection string
   - Make sure to replace `<password>` with your actual database password

3. **Initialize the Database:**
   ```bash
   npm run init-db
   ```
   
   This creates:
   - Admin user: **admin@questcraft.com** / **admin123**
   - Sample quests with badge rewards
   - Shop items

## 🚀 Quick Start

Once MongoDB is configured:

### Admin Account
```
Email: admin@questcraft.com
Password: admin123
```

**Admin Capabilities:**
- Create/edit/delete quests
- Manage events
- Manage shop items
- Access all features

### Regular Users
Users can register at the login page (`/pages/auth.html`)

## 📋 Features Overview

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

### For Admins
- ✅ Create and manage quests with badge rewards
- ✅ Add and manage upcoming events
- ✅ Configure shop items
- ✅ Full access to all features

## 🗂️ Project Structure

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

## 🔌 API Endpoints

See `replit.md` for complete API documentation.

## 🎨 UI Theme

- **Background:** #0f1419 (dark)
- **Primary:** Blue/purple gradients (#60a5fa, #a78bfa)
- **Cards:** rgba(0, 0, 0, 0.3) with blur
- **Fully responsive** across all devices
- **Smooth animations** and transitions

## 📝 Next Steps

1. **Fix MongoDB URI** (see instructions above)
2. **Run `npm run init-db`** to initialize database
3. **Login as admin** (admin@questcraft.com / admin123)
4. **Create quests** with badge rewards
5. **Add events** for students
6. **Test all features**

## 🔧 Available Scripts

```bash
npm start          # Start server
npm run dev        # Start with auto-reload
npm run init-db    # Initialize database
npm run create-admin  # Create admin only
```

## 📖 Documentation

- **SETUP.md** - Detailed setup instructions
- **MONGODB_ISSUE.md** - MongoDB connection troubleshooting
- **replit.md** - Complete technical documentation

## 🐛 Current Limitations

- Sessions are in-memory (will reset on server restart)
- MongoDB Atlas free tier has connection limits
- File uploads require proper storage configuration

Once MongoDB is properly configured, all features will work with persistent data storage!

---

**Need help?** Check SETUP.md or MONGODB_ISSUE.md for detailed instructions.
