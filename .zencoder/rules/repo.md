---
description: Repository Information Overview
alwaysApply: true
---

# ACM Learning - Gamified Student Management System

## Summary
A comprehensive web application that gamifies the academic experience for students, featuring assignment tracking, study sessions, quests, achievements, and a virtual shop system. Built for the Association for Computing Machinery (ACM) to enhance student engagement and academic performance.

## Structure
- **config/**: Database configuration
- **controllers/**: Business logic controllers for API endpoints
- **middleware/**: Authentication and upload middleware
- **models/**: MongoDB schemas for data entities
- **public/**: Frontend assets and HTML pages
- **routes/**: API route definitions
- **scripts/**: Database initialization scripts
- **utils/**: Utility functions

## Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js v14+ (as specified in README)
**Build System**: npm
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- express (^5.1.0): Web framework
- mongoose (^8.19.1): MongoDB ODM
- bcryptjs (^3.0.2): Password hashing
- express-session (^1.18.2): Session management
- connect-mongo (^5.1.0): MongoDB session store
- dotenv (^17.2.3): Environment variable management
- multer (^2.0.2): File upload handling
- compression (^1.8.1): Response compression
- express-rate-limit (^8.1.0): API rate limiting
- ioredis (^5.8.1): Redis client

**Development Dependencies**:
- nodemon (^3.1.10): Development server with auto-reload

## Build & Installation
```bash
# Install dependencies
npm install

# Initialize sample data
npm run init-db

# Create admin user (optional)
npm run create-admin

# Development mode
npm run dev

# Production mode
npm start
```

## Database
**Type**: MongoDB
**Connection**: MongoDB Atlas (cloud-hosted)
**Models**:
- User: Student profiles with XP, coins, level, badges, inventory
- Assignment: Academic assignments with due dates and rewards
- Exam: Scheduled exams with difficulty and study requirements
- Grade: Academic performance records with GPA calculation
- StudySession: Study time tracking with XP rewards
- Quest: Gamified challenges with badge rewards
- ShopItem: Virtual store items for purchase
- Event: ACM events and academic deadlines
- Activity: User activity feed and notifications
- UserQuest: Quest progress tracking

## Architecture
**Backend**: Node.js + Express RESTful API
**Frontend**: Vanilla JavaScript with Multi-Page Application approach
**Authentication**: Session-based with bcrypt password hashing
**Session Storage**: MongoDB-backed sessions with connect-mongo

## Main Entry Points
**Server**: server.js (Express server initialization)
**Application**: app.js (Express application setup)
**Frontend**: public/index.html (Main dashboard)
**API Routes**:
- /api/auth: Authentication endpoints
- /api/assignments: Assignment management
- /api/exams: Exam tracking
- /api/quests: Quest system
- /api/study-sessions: Study time tracking
- /api/grades: Academic performance
- /api/shop: Virtual store
- /api/events: Event management

## Environment Configuration
**Required Variables**:
- MONGODB_URI: MongoDB connection string
- SESSION_SECRET: Secret for session encryption
- PORT: Server port (default: 5000)