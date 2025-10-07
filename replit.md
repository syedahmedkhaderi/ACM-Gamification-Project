# QuestCraft - Gamified Learning Platform

## Overview
QuestCraft is a gamified learning platform that transforms everyday study tasks into an engaging game. Students can complete assignments, schedule exams, log study sessions, record grades, and chase quests to earn XP, coins, achievements, and levels.

## Project Information
- **Type**: Full-stack web application
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express
- **Database**: In-memory storage (resets on server restart)
- **Port**: 5000

## Recent Changes
- **2025-10-07**: Initial Replit setup
  - Configured server to run on port 5000 with host 0.0.0.0
  - Added npm start script
  - Added missing `/api/activities` endpoint
  - Configured workflow for automatic server restart

## Project Architecture

### Backend Structure
- **server.js** - Entry point that starts the Express server
- **app.js** - Express app configuration with middleware and routes
- **data/store.js** - In-memory data storage and helper functions
- **controllers/** - Route handlers for CRUD operations
- **routes/** - Express routers mounted under /api

### Frontend Structure
- **public/index.html** - Dashboard (main page)
- **public/app.js** - Shared frontend logic across all pages
- **public/style.css** - Global styles and theme
- **public/pages/** - Additional pages (assignments, exams, study, grades, quests, shop)

### API Endpoints
- `/api/user` - User profile and data
- `/api/stats` - User statistics (completed tasks, GPA, etc.)
- `/api/activities` - Activity feed (latest 20 activities)
- `/api/assignments` - Assignment CRUD operations
- `/api/exams` - Exam CRUD operations
- `/api/study-sessions` - Study session management
- `/api/grades` - Grade tracking
- `/api/quests` - Quest progress and completion

## Key Features
- Dashboard with user stats, XP bar, and activity feed
- Assignment management with due dates and priorities
- Exam scheduling with difficulty levels
- Pomodoro study timer (25-minute sessions)
- Grade tracking with automatic GPA calculation
- Quest system with daily and weekly goals
- Reward shop (demo UI)
- Dark theme with animated gradients

## Development

### Running Locally
```bash
npm install
npm start
```

### Running with Auto-reload
```bash
npm run dev
```

## User Preferences
None specified yet.

## Notes
- Data is stored in memory and resets on server restart
- Default user: Syed Ahmed, Software Engineer
- Pre-populated with sample assignments, exams, grades, and quests
