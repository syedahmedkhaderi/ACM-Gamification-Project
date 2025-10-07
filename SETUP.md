# QuestCraft v2.0 - Complete Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Fix MongoDB Connection

Your current `MONGODB_URI` secret has an incomplete cluster URL. Follow these steps:

1. **Get MongoDB Atlas Connection String:**
   - Visit [MongoDB Atlas](https://cloud.mongodb.com)
   - Login to your account
   - Click on your cluster (or create a free one if you don't have one)
   - Click the **"Connect"** button
   - Choose **"Connect your application"**
   - Copy the **complete** connection string

2. **Update Replit Secret:**
   - In Replit, click the **Secrets** icon (🔒) in the left sidebar
   - Find `MONGODB_URI`
   - Replace with your complete connection string
   - Example format:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/questcraft
     ```
   - **Important:** Replace `<password>` with your actual database password

3. **Verify the Format:**
   Your connection string should include the cluster identifier (like `cluster0.xxxxx`):
   ```
   ✅ CORRECT: mongodb+srv://user:pass@cluster0.ab123.mongodb.net/questcraft
   ❌ WRONG:   mongodb+srv://user:pass@cluster.mongodb.net/questcraft
   ```

### Step 2: Initialize Database

Once MongoDB is configured, run:

```bash
npm run init-db
```

This creates:
- Admin user account
- Sample quests with badge rewards
- Shop items
- Sample events

### Step 3: Login & Test

1. The server restarts automatically after init
2. Visit your app at the root URL
3. Login with admin credentials:
   - **Email:** `admin@questcraft.com`
   - **Password:** `admin123`

## 📋 Default Admin Account

```
Email: admin@questcraft.com
Password: admin123
```

**⚠️ Change this password in production!**

## 🎯 What You Can Do

### As Admin:
- ✅ Create/edit/delete quests (with badge rewards)
- ✅ Manage events (add upcoming school events)
- ✅ Configure shop items
- ✅ All regular user features

### As Student:
- ✅ Complete assignments → earn XP & coins
- ✅ Schedule exams and track study hours
- ✅ Use Pomodoro timer for study sessions
- ✅ Track grades and view GPA
- ✅ Complete quests → earn badges
- ✅ Purchase items from shop
- ✅ Customize profile with avatar & title
- ✅ View leaderboard rankings

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Problem:** Server shows "MongoDB connection error"

**Solutions:**
1. Check if `MONGODB_URI` is complete (includes cluster identifier)
2. Verify database password is correct (no special characters unencoded)
3. Ensure your IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for testing)
4. Check if cluster is active in MongoDB Atlas

### Can't Login

**Problem:** Login doesn't work

**Solutions:**
1. Ensure database is initialized (`npm run init-db`)
2. Check browser console for errors
3. Verify MongoDB connection is successful

### Sessions Lost on Restart

**Expected behavior** - Sessions are currently in-memory and reset when server restarts. Once MongoDB is properly configured, you can optionally enable MongoDB session storage for persistent sessions.

## 📁 Project Structure

```
questcraft/
├── config/              # Database configuration
├── models/              # Data models (User, Quest, etc.)
├── controllers/         # Business logic
├── routes/             # API routes with auth protection
├── middleware/         # Authentication & file upload
├── public/             # Frontend files
│   ├── pages/         # HTML pages
│   ├── app.js         # Frontend JavaScript
│   └── style.css      # Styles
├── scripts/           # Database initialization
└── uploads/           # User uploaded avatars
```

## 🌐 MongoDB Atlas Setup (New Users)

If you don't have MongoDB Atlas:

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for free

2. **Create Cluster:**
   - Choose "FREE" shared cluster
   - Select a cloud provider and region
   - Name your cluster (e.g., "questcraft")
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User:**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Choose password authentication
   - Create username and password (save these!)
   - Set role to "Atlas admin" or "Read and write to any database"

4. **Allow Network Access:**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String:**
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Add to Replit Secrets as `MONGODB_URI`

## 🔐 Security Notes

### For Development:
- ✅ In-memory sessions work fine
- ✅ Admin credentials are default (change them!)

### Before Publishing:
- 🔒 Change admin password
- 🔒 Use strong SESSION_SECRET (add to Secrets)
- 🔒 Enable MongoDB session store for persistent auth
- 🔒 Configure proper CORS if needed
- 🔒 Set up proper error logging

## 📝 Available Commands

```bash
# Start the server
npm start

# Start with auto-reload (development)
npm run dev

# Initialize database with admin and sample data
npm run init-db

# Create admin user only (if already initialized)
npm run create-admin
```

## 🎨 Customization

### Quest Badge Rewards
Only admins can create quests. When creating a quest:
- Set the badge icon (emoji)
- Define the target (e.g., "Complete 5 assignments")
- Quests reward ONLY badges (no XP/coins)

### Shop Items
Configure items with:
- Price in coins
- Effect/buff description
- Icon (emoji)
- Type (consumable, permanent, etc.)

### Events
Add upcoming school events:
- Exam dates
- Project deadlines
- School activities
- Study group sessions

## 🚀 Next Steps

1. ✅ Fix MongoDB URI
2. ✅ Run `npm run init-db`
3. ✅ Login as admin
4. ✅ Create quests with badges
5. ✅ Add events
6. ✅ Test features
7. ✅ Create student accounts
8. ✅ Publish your app!

---

Need more help? Check **MONGODB_ISSUE.md** for detailed MongoDB troubleshooting.
