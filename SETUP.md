# QuestCraft Setup Guide

## MongoDB Database Setup

The application requires a MongoDB database to function. Currently, the MONGODB_URI secret appears to be incomplete.

### Steps to Fix:

1. **Get a Complete MongoDB Atlas Connection String:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster if you haven't already
   - Click "Connect" → "Connect your application"
   - Copy the **complete** connection string
   - It should look like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/questcraft`

2. **Update the MONGODB_URI Secret:**
   - Go to the Secrets tab in Replit (lock icon on left sidebar)
   - Find MONGODB_URI
   - Replace the current value with your complete connection string
   - Make sure to replace `<password>` with your actual database password
   - The cluster URL should be complete (not just "cluster.mongodb.net")

3. **Initialize the Database:**
   ```bash
   npm run init-db
   ```
   This will create:
   - Admin user (admin@questcraft.com / admin123)
   - Sample quests with badge rewards
   - Shop items

## Default Accounts

### Admin Account
- **Email:** admin@questcraft.com
- **Password:** admin123
- **Capabilities:**
  - Create/edit/delete quests
  - Add/edit/delete events
  - Manage shop items
  - Access all user data

### Regular Users
Users can register at `/pages/auth.html`

## Features

- **Authentication:** Register, login, logout
- **Profile:** Avatar selection (emoji/upload), badges, inventory
- **Assignments:** Create, complete, track
- **Exams:** Schedule, complete
- **Study Sessions:** Pomodoro timer (25 min)
- **Grades:** Track with automatic GPA calculation
- **Quests:** Admin-created with badge rewards (not XP/coins)
- **Shop:** Purchase items with coins, use from inventory
- **Events:** Admin can create upcoming events
- **Leaderboard:** Top users by GPA → study hours → badges

## Port Information
- Frontend server: Port 5000
