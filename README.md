## QuestCraft – Gamified Learning Platform

### Overview

QuestCraft transforms everyday study tasks into an engaging game. Complete assignments, schedule exams, log study sessions, record grades, and chase quests to earn XP, coins, achievements, and levels. A clean, multi‑page UI keeps things simple while a lightweight Express backend serves RESTful APIs and demo data from memory.

### Key Features

- **Dashboard at a glance**: See name, title, level, coins, streak, XP bar, active quests, deadlines, recent achievements, and latest activity.
- **Assignments**: Create, edit, complete, and delete. Rewards: XP + coins. Due date sorting, priority badges, and completion flow.
- **Exams**: Plan tests/quizzes with date, difficulty, and study hours needed. Complete to earn XP and log activity.
- **Study Sessions (Pomodoro)**: Built‑in 25‑minute timer with Start/Pause/Reset. Completing a session logs time, grants XP/coins, and appears in Recent Sessions and Activity.
- **Grades & GPA**: Add grade entries with score and max score. GPA is calculated from grade points; list shows latest first.
- **Quests**: Daily and weekly goals with progress bars and automatic completion rewards on reaching targets.
- **Activity Feed**: Time‑ordered log of meaningful events (completions, sessions, quest finishes) with rewards earned.
- **Reward Shop (demo UI)**: Displays items with coin prices; purchasing updates user coins.
- **Polished UI**: Dark theme, animated gradients, subtle hover effects, and consistent cards.
- **Global notifications**: Lightweight toast system for success/error feedback.
- **Footer**: Consistent copyright footer across pages with the current year.

### System Architecture

#### RESTful API Design

- **CRUD Operations**: Full Create, Read, Update, Delete support for all resources (assignments, exams, grades, quests, study sessions)
- **RESTful Endpoints**: Standard HTTP methods (GET, POST, PUT, DELETE) with resource-based URLs
- **Modular Structure**: Separate controllers and routes for each resource type
- **Consistent Response Format**: JSON responses with proper HTTP status codes
- **Resource Relationships**: User-centric data model with proper foreign key relationships

#### Frontend

- **Stack**: Vanilla JavaScript, HTML5, CSS3 (served from `public/`).
- **Structure**: Multi‑page app (Dashboard, Assignments, Exams, Study, Grades, Quests, Shop) that shares a single `public/app.js` for behaviors per page.
- **Design**: Dark theme with blue/purple accents, CSS variables for theming, animated backgrounds, and clean card layout.
- **State**: Basic in‑memory state in the browser (`userData`, timer state); data fetched from the backend per page.

#### Backend

- **Stack**: Node.js with Express.
- **Design**: RESTful API using modular `controllers/` and `routes/`, with in‑memory data in `data/store.js`.
- **Static assets**: Served from `public/`.
- **Port**: 5007 by default.
- **Persistence**: In‑memory only (demo). Data resets on server restart.

### Project Structure

```
QuestCraft/
  app.js                # Express app: middleware, static, routes, init data
  server.js             # Boots the server (listens on PORT)
  data/
    store.js            # In‑memory state and helper functions
  controllers/          # Route handlers per resource (CRUD operations)
  routes/               # Express routers mounted under /api
  public/
    index.html          # Dashboard
    app.js              # Frontend logic shared across pages
    style.css           # Theme and components
    pages/              # Other views: assignments, exams, study, grades, quests, shop
```

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the server:
```bash
node server.js
```

3. Open in your browser:
```bash
http://localhost:5007
```

Optional (auto‑reload in dev):
```bash
npx nodemon server.js
```

### API Overview

Base URL: `http://localhost:5007/api`

- **User**
  - `GET /user` – Get the current user
  - `PUT /user` – Update user fields (e.g., name, coins)
  - `GET /stats` – Derived stats (completed/pending counts, exams, GPA)

- **Assignments** (`/assignments`)
  - `GET /` – List assignments (sorted by due date)
  - `POST /` – Create assignment (defaults rewards if missing)
  - `PUT /:id` – Update assignment
  - `DELETE /:id` – Delete assignment
  - `POST /:id/complete` – Mark complete, award XP/coins, log activity

- **Exams** (`/exams`)
  - `GET /` – List exams (sorted by date)
  - `POST /` – Create exam/quiz
  - `PUT /:id` – Update exam
  - `DELETE /:id` – Delete exam
  - `POST /:id/complete` – Mark complete, award XP, log activity

- **Study Sessions** (`/study-sessions`)
  - `GET /` – Recent sessions (latest 10)
  - `POST /` – Create session, calculates XP/coins, updates totals

- **Grades** (`/grades`)
  - `GET /` – List grades (latest first)
  - `POST /` – Add grade (computes grade points)
  - `DELETE /:id` – Delete grade

- **Quests** (`/quests`)
  - `GET /` – List quests (active/completed)
  - `POST /:id/progress` – Increment progress; auto‑complete when target reached


- **Activities**
  - `GET /activities` – Latest 20 activities (used by dashboard)

### Data Model (In‑Memory Demo)

- `user`: XP, level, coins, streak, totals, title/avatar
- `assignments`: title, subject, description, dueDate, priority, status, rewards
- `exams`: title, subject, type, date, difficulty, studyHoursNeeded, status, rewards
- `studySessions`: subject, duration, xpEarned, coinEarned, date
- `grades`: subject, examTitle, score, maxScore, gradePoints, date, semester
- `quests`: daily/weekly, target, progress, expiresAt, rewards, status
- `activities`: normalized log of important events (type, icon, rewards, createdAt)

All data lives in memory and is re‑created on each boot (`initializeData()` in `data/store.js`). The system implements a complete CRUD layer with proper data validation and relationship management.

### Configuration

- Default port is `5007`. To change, update `server.js` (and your client URLs if needed).
- No database or environment variables are required for the demo.

### Roadmap

- Persistence layer (e.g., SQLite/Postgres/Mongo) and proper data access layer
- Authentication (email/password or OAuth) and multi‑user support
- Streak engine improvements (date rollovers, shields)
- Advanced shop logic (inventory, consumables, cosmetics)
- More quest templates; admin tools for content
- Accessibility and keyboard navigation improvements
- PWA support (offline read, Add to Home Screen)

### License

ISC


