# QuestCraft Warp Optimization

This directory contains comprehensive Warp terminal optimizations specifically designed for the **QuestCraft** gamified learning platform development environment.

## 🎯 Overview

QuestCraft is a Node.js/Express/MongoDB gamified learning platform where students earn XP, coins, and badges through completing assignments, exams, and quests. This Warp configuration provides:

- **Streamlined development workflows**
- **Custom commands and aliases**
- **Launch profiles for different scenarios**
- **Environment management**
- **Dark theme matching QuestCraft's aesthetic**

## 📁 Configuration Files

### Core Configuration
- **`warp.yaml`** - Main configuration with project metadata, quick actions, and AI context
- **`aliases.yaml`** - Custom shortcuts for common development tasks
- **`launch.yaml`** - Pre-configured launch profiles for different scenarios
- **`workflows.yaml`** - Step-by-step workflows for complex tasks
- **`environment.yaml`** - Environment variables and deployment configurations
- **`theme.yaml`** - Custom dark theme matching QuestCraft's UI

## 🚀 Quick Start

### Essential Commands (Available Immediately)
```bash
# Server Management
dev             # Start development server (npm run dev)
start           # Start production server
fresh           # Clear terminal and restart dev server

# Database Operations  
db              # Check MongoDB connection status
db-init         # Initialize database with admin user and sample data
admin           # Create admin user only

# Development Utilities
status          # Show QuestCraft system status
check           # Run system health check
cls             # Clear terminal with project info
```

### Launch Profiles
```bash
# Quick launch shortcuts (if supported by Warp)
warp launch dev          # 🚀 Development Server
warp launch db           # 🗄️ Database Setup  
warp launch check        # 🔍 System Health Check
warp launch fresh        # 🔄 Fresh Development Start
```

### Workflows
```bash
# Complete workflows (if supported by Warp)
warp workflow setup      # 🆕 First-time project setup
warp workflow daily      # ☀️ Daily development routine
warp workflow test       # 🧪 Feature testing workflow
warp workflow deploy     # 🚀 Production deployment prep
```

## 🎮 QuestCraft-Specific Features

### Admin Account
- **Email:** `admin@questcraft.com`
- **Password:** `admin123`
- **URL:** `http://localhost:5000/pages/auth.html`

### Key Development Commands
```bash
# MongoDB Setup Help
mongo-help      # Step-by-step MongoDB Atlas setup guide

# Feature Testing
test-admin      # Display admin login credentials
test-quest      # Quest system testing checklist  
test-shop       # Shop system testing checklist

# File Navigation
routes          # List all route files
models          # List all model files
controllers     # List all controller files
config          # Show database configuration
```

### System Status Commands
```bash
status          # Complete system overview
check           # Health check with detailed diagnostics
db              # MongoDB connection test
deps            # Install dependencies
audit           # Security vulnerability check
fix             # Fix security issues automatically
```

## 🗄️ Database Management

### MongoDB Atlas Setup
1. **Get Connection String:**
   ```bash
   mongo-help  # Shows step-by-step instructions
   ```

2. **Initialize Database:**
   ```bash
   db-init     # Creates admin user and sample data
   ```

3. **Test Connection:**
   ```bash
   db          # Quick connection test
   ```

### Database Commands
```bash
db              # Test MongoDB connection
db-init         # Initialize with admin user and sample data
db-reset        # Same as db-init (resets database)
admin           # Create admin user only
```

## ⚡ Development Workflows

### Daily Development
```bash
fresh           # Clear terminal and start development server
# or
cls && dev      # Alternative approach
```

### First-Time Setup
```bash
# 1. Install dependencies
deps

# 2. Check MongoDB connection  
db

# 3. Initialize database
db-init

# 4. Start development server
dev
```

### Feature Testing
```bash
# 1. Start server
dev

# 2. Test admin features
test-admin      # Shows admin login info

# 3. Test core features  
test-quest      # Quest system checklist
test-shop       # Shop system checklist
```

## 🎨 Theme Integration

The custom **QuestCraft Dark** theme matches your application's design:

- **Background:** `#0f1419` (matching QuestCraft's main background)
- **Accents:** Blue (`#60a5fa`) and Purple (`#a78bfa`) gradients
- **Success states:** Green (`#34d399`)
- **Icons:** Matching QuestCraft's emoji-based UI

### Theme Features
- Dark background matching QuestCraft UI
- Blue/purple accent colors for commands
- Visual indicators for different command types
- Syntax highlighting for code editing

## 🔧 Environment Management

### Development Environment
```bash
NODE_ENV=development
PORT=5000
DEBUG=questcraft:*
MONGODB_URI=<your-atlas-connection-string>
```

### Production Environment  
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=<production-database-uri>
SESSION_SECRET=<strong-secret-key>
```

### Environment Commands
```bash
show-env        # Display current environment variables
validate-env    # Validate environment configuration
```

## 📊 Health Checks

### System Health
```bash
check           # Complete system health check
```

This checks:
- ✅ Node.js and npm versions
- ✅ Package dependencies
- ✅ MongoDB connection
- ✅ Port availability (5000)
- ✅ Security audit

### Individual Checks
```bash
db              # MongoDB connection only
deps            # Dependency status
audit           # Security vulnerabilities
```

## 🛠️ Troubleshooting

### MongoDB Connection Issues
```bash
mongo-help      # Step-by-step setup guide
db              # Test current connection
```

### Common Issues
1. **"MongoDB connection error"**
   - Run `mongo-help` for setup instructions
   - Ensure MONGODB_URI includes cluster identifier
   - Check IP whitelist in MongoDB Atlas

2. **"Port 5000 in use"**
   - Run `check` to see port status
   - Kill process: `lsof -ti:5000 | xargs kill`

3. **Package issues**
   - Run `deps` to reinstall
   - Run `audit` and `fix` for security issues

## 📝 Customization

### Adding Custom Commands
Edit `.warp/aliases.yaml`:
```yaml
aliases:
  your-command: "your shell command here"
```

### Adding Launch Profiles
Edit `.warp/launch.yaml`:
```yaml
launch_profiles:
  your_profile:
    name: "Your Profile Name"
    command: "your command"
    # ... other options
```

### Modifying Workflows
Edit `.warp/workflows.yaml` to add custom step-by-step workflows.

## 🎯 Tips for Maximum Efficiency

1. **Use shortcuts:** `dev`, `db`, `fresh`, `check` for common tasks
2. **Check status regularly:** `status` shows complete system overview
3. **Use workflows:** Complex tasks like setup and testing are automated
4. **Monitor health:** `check` command identifies issues before they cause problems
5. **Quick restart:** `fresh` clears logs and restarts development server

## 📚 Additional Resources

- **`SETUP.md`** - Detailed QuestCraft setup instructions
- **`WARP.md`** - Original Warp guidance for the project
- **`README.md`** - Main project documentation
- **`MONGODB_ISSUE.md`** - MongoDB troubleshooting guide

## 🆘 Need Help?

1. **MongoDB Setup:** Run `mongo-help`
2. **System Issues:** Run `check`
3. **Feature Testing:** Run `test-admin`, `test-quest`, `test-shop`
4. **General Status:** Run `status`

---

**Happy coding with QuestCraft! 🎮✨**