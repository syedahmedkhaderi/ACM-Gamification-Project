# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

QuestCraft is a gamified learning platform built with Node.js, Express, MongoDB, and vanilla JavaScript. It helps students track assignments, exams, grades, and study sessions while earning XP, coins, and badges through a quest-based system.

## Architecture

### Backend Architecture (MVC Pattern)
- **server.js**: Entry point that starts the Express server
- **app.js**: Main application configuration, middleware setup, and route mounting
- **config/**: Database connection configuration
- **models/**: Mongoose schemas defining data structure
- **controllers/**: Business logic for handling requests
- **routes/**: API endpoint definitions with authentication middleware
- **middleware/**: Authentication (`isAuthenticated`, `isAdmin`) and file upload handling

### Data Models
The application uses MongoDB with Mongoose ODM. Key models include:
- **User**: Core user data with role-based access (user/admin), XP system, badges, inventory
- **Quest**: Badge-based quest system with different types (daily/weekly/special)
- **Assignment/Exam**: Academic task tracking with status management
- **Grade**: GPA calculation and academic performance tracking
- **StudySession**: Pomodoro timer sessions and study time tracking
- **ShopItem**: Virtual items purchasable with coins
- **Event**: Admin-managed upcoming events
- **Activity**: User action logging for gamification

### Frontend Architecture
- **public/**: Static frontend files served by Express
- **public/app.js**: Main frontend JavaScript with API calls and UI logic
- **public/style.css**: Dark theme styling with blue/purple gradients
- **public/pages/**: HTML pages (auth, profile, events, etc.)

### Authentication & Authorization
- Session-based authentication using `express-session`
- BCrypt password hashing
- Role-based access control with `user` and `admin` roles
- Protected routes using `isAuthenticated` and `isAdmin` middleware
- Sessions stored in-memory (can be configured for MongoDB persistence)

## Development Commands

### Core Commands
```bash
# Start the server in production mode
npm start

# Start with auto-reload for development
npm run dev

# Initialize database with admin user and sample data
npm run init-db

# Create admin user only (if database already has data)
npm run create-admin
```

### Database Setup
Before running the application, ensure MongoDB is configured:

1. **Configure MongoDB URI**:
   - Set `MONGODB_URI` environment variable with complete connection string
   - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/questcraft`

2. **Initialize Database**:
   ```bash
   npm run init-db
   ```
   This creates:
   - Admin user: `admin@questcraft.com` / `admin123`
   - Sample quests with badge rewards
   - Default shop items
   - Sample events

### Testing Development Features
```bash
# Test server startup
npm start

# Access application at http://localhost:5000

# Login as admin to test admin features
# Email: admin@questcraft.com
# Password: admin123
```

## Key Development Patterns

### Route Protection
All API routes use authentication middleware:
```javascript
// Public routes
router.post('/login', controller.login);

// Protected routes
router.get('/profile', isAuthenticated, controller.getProfile);

// Admin-only routes
router.post('/quests', isAdmin, controller.createQuest);
```

### Error Handling
Controllers use consistent error response pattern:
```javascript
try {
  // Business logic
  res.json(result);
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

### Session Management
User sessions store essential data:
- `req.session.userId`: MongoDB user ID
- `req.session.role`: User role (user/admin)

### Database Operations
- All models use Mongoose with validation
- Password hashing handled automatically via pre-save middleware
- Complex queries use aggregation for leaderboard calculations
- User progress tracking through embedded documents (badges, inventory)

## Admin vs User Functionality

### Admin Capabilities
- Create, edit, delete quests with badge rewards
- Manage events (school events, deadlines)
- Configure shop items with coin prices
- Access all user features

### User Capabilities
- Complete assignments and earn XP/coins
- Schedule and track exams with study sessions
- Use Pomodoro timer (25-minute sessions)
- Track grades with automatic GPA calculation
- Complete quests to earn unique badges
- Purchase items from shop using earned coins
- Customize profile with emoji or uploaded avatar
- View leaderboard rankings (sorted by GPA → study time → badges)

## File Structure Context

### Critical Paths
- `scripts/initializeData.js`: Database initialization with sample data
- `middleware/auth.js`: Authentication and authorization logic
- `config/database.js`: MongoDB connection with error handling
- `models/User.js`: Core user model with gamification features
- `public/app.js`: Frontend JavaScript handling all UI interactions

### Configuration Files
- `package.json`: Dependencies and NPM scripts
- `.env` / Replit Secrets: MongoDB URI and session secrets
- `public/style.css`: Complete dark theme implementation

## Development Notes

### Session Storage
Currently uses in-memory sessions that reset on server restart. For production, consider MongoDB session storage using `connect-mongo`.

### File Uploads
Avatar uploads handled via `multer` middleware, stored in `uploads/avatars/` directory.

### Gamification System
- XP earned from completed assignments/exams
- Coins earned alongside XP for shop purchases  
- Badges earned exclusively through quest completion (no XP/coin rewards)
- Leaderboard ranking prioritizes academic performance (GPA) over gamification metrics

### Database Dependencies
Application gracefully handles MongoDB connection failures but requires valid connection for full functionality. All routes will return appropriate errors when database is unavailable.