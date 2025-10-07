const API_URL = '/api';
let userData = null;
let timerInterval = null;
let timerRunning = false;
const pomodoroDurationMs = 25 * 60 * 1000; // 25 minutes
let timerStartTimestamp = null; // when the session actually started (or resumed)
let pausedElapsedMs = 0; // accumulated elapsed time while paused/running

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    // Footer year injection
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    // Keep display in sync if tab visibility changes (background/foreground)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateTimerDisplay();
        }
    });
});

// Reusable confirmation dialog using the existing modal UI
function confirmDialog(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        if (!modal || !modalBody) {
            // Fallback in rare case modal is missing
            return resolve(window.confirm(message));
        }

        modalBody.innerHTML = `
            <h2 style="margin-bottom: 1rem;">Confirm Deletion</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${message}</p>
            <div style="display:flex; gap: 0.75rem; justify-content: flex-end;">
                <button id="confirmCancelBtn" class="btn btn-secondary">Cancel</button>
                <button id="confirmDeleteBtn" class="btn btn-danger">Delete</button>
            </div>
        `;
        modal.style.display = 'block';

        const cleanup = () => {
            // remove listeners to avoid leaks
            cancelBtn.removeEventListener('click', onCancel);
            deleteBtn.removeEventListener('click', onDelete);
        };

        const cancelBtn = document.getElementById('confirmCancelBtn');
        const deleteBtn = document.getElementById('confirmDeleteBtn');

        const onCancel = () => {
            cleanup();
            closeModal();
            resolve(false);
        };
        const onDelete = () => {
            cleanup();
            closeModal();
            resolve(true);
        };

        cancelBtn.addEventListener('click', onCancel);
        deleteBtn.addEventListener('click', onDelete);
    });
}

// Styled single-action dialog matching site UI
function showErrorDialog(message, title = 'Heads up') {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        if (!modal || !modalBody) {
            // Fallback
            alert(message); // eslint-disable-line no-alert
            return resolve();
        }
        modalBody.innerHTML = `
            <h2 style="margin-bottom: 1rem;">${title}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${message}</p>
            <div style=\"display:flex; gap: 0.75rem; justify-content: flex-end;\">
                <button id="errorOkBtn" class="btn btn-primary">OK</button>
            </div>
        `;
        modal.style.display = 'block';

        const okBtn = document.getElementById('errorOkBtn');
        const onOk = () => {
            okBtn.removeEventListener('click', onOk);
            closeModal();
            resolve();
        };
        okBtn.addEventListener('click', onOk);
    });
}

function setupEventListeners() {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.addEventListener('blur', updateUserName);
        userNameElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        });
    }
    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
}

// SPA navigation removed. Each page loads only the content it contains.

async function initializeApp() {
    await checkAuth();
    await loadUser();
    // Conditionally load modules based on elements present on the page
    if (document.getElementById('dashboard')) {
        await loadDashboard();
    }
    if (document.getElementById('assignmentsList')) {
        await loadAssignments();
    }
    if (document.getElementById('examsList')) {
        await loadExams();
    }
    if (document.getElementById('studySessionsList')) {
        await loadStudySessions();
    }
    if (document.getElementById('gradesList')) {
        await loadGrades();
    }
    if (document.getElementById('questsList')) {
        await loadQuests();
    }
    if (document.getElementById('shopCoins')) {
        updateShopCoins();
    }
    if (document.getElementById('eventsList')) {
        await loadEvents();
    }
    if (document.getElementById('profileName')) {
        await loadProfile();
    }
    if (document.getElementById('leaderboardList')) {
        await loadLeaderboard();
    }
    if (document.getElementById('upcomingEvents')) {
        await loadUpcomingEventsWidget();
    }
    updateNavAvatar();
}

async function loadUser() {
    try {
        const response = await fetch(`${API_URL}/user`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            userData = await response.json();
            updateUserDisplay();
        } else {
            console.error('Error loading user:', response.status);
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

function updateUserDisplay() {
    if (!userData) return;

    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.textContent = userData.name;
    const titleEl = document.getElementById('userTitle');
    if (titleEl) titleEl.textContent = userData.title;
    const levelEl = document.getElementById('userLevel');
    if (levelEl) levelEl.textContent = userData.level;
    const coinsEl = document.getElementById('userCoins');
    if (coinsEl) coinsEl.textContent = userData.coins;
    const streakEl = document.getElementById('userStreak');
    if (streakEl) streakEl.textContent = userData.streak;
    const shopCoinsEl = document.getElementById('shopCoins');
    if (shopCoinsEl) shopCoinsEl.textContent = userData.coins;

    const currentXP = userData.xp % 100;
    const nextLevelXP = 100;
    const currentXPEl = document.getElementById('currentXP');
    if (currentXPEl) currentXPEl.textContent = currentXP;
    const nextLevelXPEl = document.getElementById('nextLevelXP');
    if (nextLevelXPEl) nextLevelXPEl.textContent = nextLevelXP;

    const xpBar = document.getElementById('xpBar');
    if (xpBar) {
        xpBar.style.width = `${(currentXP / nextLevelXP) * 100}%`;
    }

    const userAvatar = userData.avatar || '🎓';
    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl) avatarEl.textContent = userAvatar;
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) profileAvatar.textContent = userAvatar;

    updateNavAvatar();
    updateShopButtons();
}

async function updateUserName() {
    const newName = document.getElementById('userName').textContent.trim();
    if (newName && userData && newName !== userData.name) {
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: newName })
            });
            userData = await response.json();
            showNotification('✅ Name updated successfully!');
        } catch (error) {
            console.error('Error updating name:', error);
            showNotification('❌ Failed to update name');
        }
    }
}

async function loadDashboard() {
    await loadUser();
    await loadStats();
    await loadActiveQuests();
    await loadUpcomingDeadlines();
    await loadActivityFeed();
    if (document.getElementById('leaderboardList')) {
        await loadLeaderboard();
    }
    if (document.getElementById('upcomingEvents')) {
        await loadUpcomingEventsWidget();
    }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`, {
            credentials: 'include'
        });
        const stats = await response.json();

        document.getElementById('statCompleted').textContent = stats.completedAssignments;
        document.getElementById('statPending').textContent = stats.pendingAssignments;
        document.getElementById('statGPA').textContent = stats.gpa || '0.0';
        document.getElementById('statStudyHours').textContent = Math.floor(userData.totalStudyMinutes / 60);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadActiveQuests() {
    try {
        const response = await fetch(`${API_URL}/quests`, {
            credentials: 'include'
        });
        const quests = await response.json();
        const activeQuests = quests.filter(q => q.status === 'active').slice(0, 3);

        const container = document.getElementById('activeQuestsList');
        if (activeQuests.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No active quests</p>';
            return;
        }

        container.innerHTML = activeQuests.map(quest => `
            <div class="quest-item" style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>${quest.title}</strong>
                    <span style="color: var(--accent-purple);">${quest.progress}/${quest.target}</span>
                </div>
                <div class="quest-progress">
                    <div class="quest-progress-bar" style="width: ${(quest.progress / quest.target) * 100}%"></div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading quests:', error);
    }
}

async function loadUpcomingDeadlines() {
    try {
        const [assignmentsRes, examsRes] = await Promise.all([
            fetch(`${API_URL}/assignments`),
            fetch(`${API_URL}/exams`)
        ]);

        const assignments = await assignmentsRes.json();
        const exams = await examsRes.json();

        const upcoming = [
            ...assignments.filter(a => a.status !== 'completed').map(a => ({ ...a, type: 'assignment' })),
            ...exams.filter(e => e.status !== 'completed').map(e => ({ ...e, type: 'exam' }))
        ].sort((a, b) => new Date(a.dueDate || a.date) - new Date(b.dueDate || b.date)).slice(0, 5);

        const container = document.getElementById('upcomingDeadlines');
        if (upcoming.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No upcoming deadlines</p>';
            return;
        }

        container.innerHTML = upcoming.map(item => {
            const date = new Date(item.dueDate || item.date);
            const daysUntil = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
            const icon = item.type === 'assignment' ? '📚' : '🎓';

            return `
                <div class="deadline-item" style="padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid var(--card-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-size: 1.2rem; margin-right: 0.5rem;">${icon}</span>
                            <strong>${item.title}</strong>
                        </div>
                        <span style="color: ${daysUntil <= 1 ? 'var(--danger)' : 'var(--accent-purple)'}; font-weight: 600;">
                            ${daysUntil} day${daysUntil !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading deadlines:', error);
    }
}

async function loadActivityFeed() {
    try {
        const response = await fetch(`${API_URL}/activities`);
        const activities = await response.json();

        const container = document.getElementById('activityFeed');
        if (activities.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No recent activities</p>';
            return;
        }

        container.innerHTML = activities.slice(0, 10).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div style="flex: 1;">
                    <strong>${activity.title}</strong>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">${activity.description}</p>
                </div>
                <div style="text-align: right;">
                    ${activity.xpGained > 0 ? `<div style="color: var(--accent-purple);">+${activity.xpGained} XP</div>` : ''}
                    ${activity.coinsGained > 0 ? `<div style="color: #fbbf24;">+${activity.coinsGained} 💰</div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading activity feed:', error);
    }
}

async function loadAssignments() {
    try {
        const response = await fetch(`${API_URL}/assignments`);
        const assignments = await response.json();

        const container = document.getElementById('assignmentsList');
        if (assignments.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No assignments yet. Create one to get started!</p>';
            return;
        }

        container.innerHTML = assignments.map(assignment => {
            const dueDate = new Date(assignment.dueDate);
            const isOverdue = dueDate < new Date() && assignment.status !== 'completed';

            return `
                <div class="assignment-card" data-assignment-id="${assignment._id}">
                    <h4>${assignment.title}</h4>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0;">${assignment.subject}</p>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">${assignment.description}</p>
                    <div style="margin: 1rem 0;">
                        <div style="color: ${isOverdue ? 'var(--danger)' : 'var(--text-secondary)'};">
                            📅 Due: ${dueDate.toLocaleDateString()}
                        </div>
                        <span class="priority-badge priority-${assignment.priority}">${assignment.priority.toUpperCase()}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        ${assignment.status !== 'completed' ? `
                            <button class="btn btn-success complete-btn" onclick="completeAssignment('${assignment._id}')" style="flex: 1;">
                                ✅ Complete (+${assignment.xpReward} XP)
                            </button>
                        ` : '<span style="color: var(--success); font-weight: 600;">✅ Completed</span>'}
                        <button class="btn btn-danger" onclick="deleteAssignment('${assignment._id}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading assignments:', error);
    }
}

async function completeAssignment(id) {
    try {
        // Optimistic UI: mark the card as completed immediately
        const card = document.querySelector(`[data-assignment-id="${id}"]`);
        if (card) {
            const btn = card.querySelector('.complete-btn');
            if (btn) {
                btn.outerHTML = '<span style="color: var(--success); font-weight: 600;">✅ Completed</span>';
            }
        }

        const response = await fetch(`${API_URL}/assignments/${id}/complete`, {
            method: 'POST'
        });
        const data = await response.json();
        userData = data.user;
        updateUserDisplay();
        showNotification('🎉 Assignment completed! +' + data.assignment.xpReward + ' XP, +' + data.assignment.coinReward + ' Coins');
        // Keep background refresh to sync other UI pieces
        loadAssignments();
        loadDashboard();
    } catch (error) {
        console.error('Error completing assignment:', error);
    }
}

async function deleteAssignment(id) {
    const ok = await confirmDialog('Are you sure you want to delete this assignment?');
    if (!ok) return;

    try {
        await fetch(`${API_URL}/assignments/${id}`, { method: 'DELETE' });
        showNotification('🗑️ Assignment deleted');
        loadAssignments();
    } catch (error) {
        console.error('Error deleting assignment:', error);
    }
}

function showAddAssignmentModal() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Add New Assignment</h2>
        <input type="text" id="newAssignmentTitle" class="input" placeholder="Title" required>
        <input type="text" id="newAssignmentSubject" class="input" placeholder="Subject" required>
        <textarea id="newAssignmentDescription" class="input" placeholder="Description" rows="3"></textarea>
        <input type="date" id="newAssignmentDueDate" class="input" required>
        <select id="newAssignmentPriority" class="input">
            <option value="low">Low Priority</option>
            <option value="medium" selected>Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
        </select>
        <button class="btn btn-primary" onclick="addAssignment()">Create Assignment</button>
    `;
    document.getElementById('modal').style.display = 'block';
}

async function addAssignment() {
    const title = document.getElementById('newAssignmentTitle').value;
    const subject = document.getElementById('newAssignmentSubject').value;
    const description = document.getElementById('newAssignmentDescription').value;
    const dueDate = document.getElementById('newAssignmentDueDate').value;
    const priority = document.getElementById('newAssignmentPriority').value;

    if (!title || !subject || !dueDate) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        await fetch(`${API_URL}/assignments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, subject, description, dueDate, priority })
        });
        closeModal();
        showNotification('✅ Assignment created!');
        loadAssignments();
    } catch (error) {
        console.error('Error adding assignment:', error);
    }
}

async function loadExams() {
    try {
        const response = await fetch(`${API_URL}/exams`);
        const exams = await response.json();

        const container = document.getElementById('examsList');
        if (exams.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No exams scheduled yet.</p>';
            return;
        }

        container.innerHTML = exams.map(exam => {
            const examDate = new Date(exam.date);
            const daysUntil = Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24));

            return `
                <div class="exam-card" data-exam-id="${exam._id}">
                    <h4>${exam.title}</h4>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0;">${exam.subject}</p>
                    <div style="margin: 1rem 0;">
                        <div style="color: ${daysUntil <= 3 ? 'var(--danger)' : 'var(--text-secondary)'};">
                            📅 ${examDate.toLocaleDateString()} (${daysUntil} days)
                        </div>
                        <span class="priority-badge priority-${exam.difficulty}">${exam.difficulty.toUpperCase()}</span>
                        <span class="priority-badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; margin-left: 0.5rem;">
                            ${exam.type.toUpperCase()}
                        </span>
                    </div>
                    <div style="color: var(--text-muted); margin: 0.5rem 0;">
                        📚 Study needed: ${exam.studyHoursNeeded} hours
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        ${exam.status !== 'completed' ? `
                            <button class="btn btn-success exam-complete-btn" onclick="completeExam('${exam._id}')" style="flex: 1;">
                                ✅ Complete (+${exam.xpReward} XP)
                            </button>
                        ` : '<span style="color: var(--success); font-weight: 600;">✅ Completed</span>'}
                        <button class="btn btn-danger" onclick="deleteExam('${exam._id}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading exams:', error);
    }
}

async function completeExam(id) {
    try {
        // Optimistic UI: mark exam card completed immediately
        const card = document.querySelector(`[data-exam-id="${id}"]`);
        if (card) {
            const btn = card.querySelector('.exam-complete-btn');
            if (btn) {
                btn.outerHTML = '<span style="color: var(--success); font-weight: 600;">✅ Completed</span>';
            }
        }
        const response = await fetch(`${API_URL}/exams/${id}/complete`, {
            method: 'POST'
        });
        const data = await response.json();
        userData = data.user;
        updateUserDisplay();
        showNotification('🎉 Exam completed! +' + data.exam.xpReward + ' XP');
        // background refresh to sync lists and dashboard
        loadExams();
        loadDashboard();
    } catch (error) {
        console.error('Error completing exam:', error);
    }
}

async function deleteExam(id) {
    const ok = await confirmDialog('Are you sure you want to delete this exam?');
    if (!ok) return;

    try {
        await fetch(`${API_URL}/exams/${id}`, { method: 'DELETE' });
        showNotification('🗑️ Exam deleted');
        loadExams();
    } catch (error) {
        console.error('Error deleting exam:', error);
    }
}

function showAddExamModal() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Add New Exam</h2>
        <input type="text" id="newExamTitle" class="input" placeholder="Title" required>
        <input type="text" id="newExamSubject" class="input" placeholder="Subject" required>
        <select id="newExamType" class="input">
            <option value="test">Test</option>
            <option value="exam" selected>Exam</option>
            <option value="quiz">Quiz</option>
        </select>
        <input type="date" id="newExamDate" class="input" required>
        <select id="newExamDifficulty" class="input">
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
        </select>
        <input type="number" id="newExamStudyHours" class="input" placeholder="Study hours needed" value="5">
        <button class="btn btn-primary" onclick="addExam()">Schedule Exam</button>
    `;
    document.getElementById('modal').style.display = 'block';
}

async function addExam() {
    const title = document.getElementById('newExamTitle').value;
    const subject = document.getElementById('newExamSubject').value;
    const type = document.getElementById('newExamType').value;
    const date = document.getElementById('newExamDate').value;
    const difficulty = document.getElementById('newExamDifficulty').value;
    const studyHoursNeeded = document.getElementById('newExamStudyHours').value;

    if (!title || !subject || !date) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        await fetch(`${API_URL}/exams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, subject, type, date, difficulty, studyHoursNeeded })
        });
        closeModal();
        showNotification('✅ Exam scheduled!');
        loadExams();
    } catch (error) {
        console.error('Error adding exam:', error);
    }
}

function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    // If starting fresh or resuming, set the start timestamp relative to elapsed
    const now = Date.now();
    if (timerStartTimestamp === null) {
        timerStartTimestamp = now - pausedElapsedMs;
    }
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const remaining = getRemainingMs();
        if (remaining <= 0) {
            pauseTimer();
            pausedElapsedMs = pomodoroDurationMs; // clamp
            updateTimerDisplay();
            showNotification('🎉 Pomodoro session complete!');
            return;
        }
        updateTimerDisplay();
    }, 1000);
    updateTimerDisplay();
}

function pauseTimer() {
    if (!timerRunning) return;
    timerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    // Accumulate elapsed when pausing
    if (timerStartTimestamp !== null) {
        pausedElapsedMs = Math.min(pomodoroDurationMs, Date.now() - timerStartTimestamp);
    }
}

function resetTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerRunning = false;
    timerStartTimestamp = null;
    pausedElapsedMs = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const remaining = getRemainingMs();
    const totalSeconds = Math.max(0, Math.ceil(remaining / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const el = document.getElementById('timerDisplay');
    if (el) {
        el.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function getElapsedMs() {
    if (timerStartTimestamp === null) return pausedElapsedMs;
    if (!timerRunning) return pausedElapsedMs;
    return Math.min(pomodoroDurationMs, Date.now() - timerStartTimestamp);
}

function getRemainingMs() {
    const elapsed = timerRunning && timerStartTimestamp !== null
        ? Date.now() - timerStartTimestamp
        : pausedElapsedMs;
    return Math.max(0, pomodoroDurationMs - Math.min(pomodoroDurationMs, elapsed));
}

async function completeStudySession() {
    const subject = document.getElementById('studySubject').value;
    if (!subject) {
        await showErrorDialog('Please enter a subject to log your study session.', 'Subject required');
        return;
    }

    // Compute duration from elapsed ms to be accurate even in background
    const elapsedMinutes = Math.max(1, Math.floor(getElapsedMs() / 60000));
    const duration = elapsedMinutes;
    if (duration < 1) {
        await showErrorDialog('Study for at least 1 minute before completing the session.', 'Not enough time');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/study-sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, duration, focusScore: 100 })
        });
        const data = await response.json();
        userData = data.user;
        updateUserDisplay();
        showNotification(`🎉 Study session complete! +${data.session.xpEarned} XP`);
        resetTimer();
        document.getElementById('studySubject').value = '';
        await loadStudySessions();
        await loadDashboard();
    } catch (error) {
        console.error('Error completing study session:', error);
    }
}

async function loadStudySessions() {
    try {
        const response = await fetch(`${API_URL}/study-sessions`);
        const sessions = await response.json();

        const container = document.getElementById('studySessionsList');
        if (sessions.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No study sessions yet</p>';
            return;
        }

        container.innerHTML = sessions.map(session => `
            <div style="padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 8px; margin-bottom: 0.75rem; border: 1px solid var(--card-border);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${session.subject}</strong>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                            ${session.duration} minutes
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: var(--accent-purple);">+${session.xpEarned} XP</div>
                        <div style="color: #fbbf24;">+${session.coinEarned} 💰</div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading study sessions:', error);
    }
}

async function loadGrades() {
    try {
        const response = await fetch(`${API_URL}/grades`);
        const grades = await response.json();

        const statsResponse = await fetch(`${API_URL}/stats`);
        const stats = await statsResponse.json();
        document.getElementById('gpaDisplay').textContent = stats.gpa || '0.0';

        const container = document.getElementById('gradesList');
        if (grades.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No grades recorded yet.</p>';
            return;
        }

        container.innerHTML = grades.map(grade => {
            const percentage = (grade.score / grade.maxScore) * 100;
            const gradeColor = percentage >= 90 ? 'var(--success)' : percentage >= 70 ? 'var(--warning)' : 'var(--danger)';

            return `
                <div class="grade-card">
                    <h4>${grade.examTitle}</h4>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0;">${grade.subject}</p>
                    <div style="font-size: 2rem; font-weight: bold; color: ${gradeColor}; margin: 1rem 0;">
                        ${grade.score}/${grade.maxScore}
                    </div>
                    <div style="color: var(--text-muted);">
                        ${percentage.toFixed(1)}% - Grade Points: ${grade.gradePoints.toFixed(1)}
                    </div>
                    <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                        📅 ${new Date(grade.date).toLocaleDateString()}
                    </div>
                    <button class="btn btn-danger" style="margin-top: 1rem;" onclick="deleteGrade('${grade._id}')">🗑️ Delete</button>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading grades:', error);
    }
}

function showAddGradeModal() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Add Grade</h2>
        <input type="text" id="newGradeExamTitle" class="input" placeholder="Exam Title" required>
        <input type="text" id="newGradeSubject" class="input" placeholder="Subject" required>
        <input type="number" id="newGradeScore" class="input" placeholder="Score" required min="0">
        <input type="number" id="newGradeMaxScore" class="input" placeholder="Max Score" value="100" required>
        <input type="date" id="newGradeDate" class="input" required>
        <button class="btn btn-primary" onclick="addGrade()">Add Grade</button>
    `;
    document.getElementById('modal').style.display = 'block';
}

async function addGrade() {
    const examTitle = document.getElementById('newGradeExamTitle').value;
    const subject = document.getElementById('newGradeSubject').value;
    const score = parseFloat(document.getElementById('newGradeScore').value);
    const maxScore = parseFloat(document.getElementById('newGradeMaxScore').value);
    const date = document.getElementById('newGradeDate').value;

    if (!examTitle || !subject || score === '' || !maxScore || !date) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        await fetch(`${API_URL}/grades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ examTitle, subject, score, maxScore, date })
        });
        closeModal();
        showNotification('✅ Grade added!');
        loadGrades();
    } catch (error) {
        console.error('Error adding grade:', error);
    }
}

async function deleteGrade(id) {
    const ok = await confirmDialog('Are you sure you want to delete this grade?');
    if (!ok) return;

    try {
        await fetch(`${API_URL}/grades/${id}`, { method: 'DELETE' });
        showNotification('🗑️ Grade deleted');
        loadGrades();
    } catch (error) {
        console.error('Error deleting grade:', error);
    }
}

async function loadQuests() {
    try {
        const response = await fetch(`${API_URL}/quests`);
        const quests = await response.json();

        const container = document.getElementById('questsList');
        if (quests.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No quests available.</p>';
            return;
        }

        container.innerHTML = quests.map(quest => {
            const expiresAt = new Date(quest.expiresAt);
            const hoursLeft = Math.max(0, Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60)));

            return `
                <div class="quest-card">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <h4>${quest.title}</h4>
                        <span class="priority-badge ${quest.type === 'daily' ? 'priority-high' : 'priority-medium'}">
                            ${quest.type.toUpperCase()}
                        </span>
                    </div>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0;">${quest.description}</p>
                    <div class="quest-progress">
                        <div class="quest-progress-bar" style="width: ${Math.min((quest.progress / quest.target) * 100, 100)}%"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                        <span style="color: var(--text-muted);">Progress: ${quest.progress}/${quest.target}</span>
                        <span style="color: ${hoursLeft <= 3 ? 'var(--danger)' : 'var(--text-secondary)'};">
                            ⏰ ${hoursLeft}h left
                        </span>
                    </div>
                    <div style="margin-top: 1rem; color: var(--accent-purple); font-weight: 600;">
                        Reward: ${quest.xpReward} XP, ${quest.coinReward} Coins
                    </div>
                    ${quest.status === 'completed' ? 
                        '<div style="color: var(--success); font-weight: 600; margin-top: 1rem;">✅ Completed!</div>' : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading quests:', error);
    }
}

function updateShopCoins() {
    if (userData) {
        document.getElementById('shopCoins').textContent = userData.coins;
    }
}

async function purchaseItem(itemName, cost) {
    if (!userData || userData.coins < cost) {
        showNotification('❌ Not enough coins!');
        return;
    }

    if (!confirm(`Purchase ${itemName} for ${cost} coins?`)) return;

    try {
        const newCoins = userData.coins - cost;
        const response = await fetch(`${API_URL}/user`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coins: newCoins })
        });
        userData = await response.json();
        updateUserDisplay();
        showNotification(`🎉 Purchased ${itemName}!`);
    } catch (error) {
        console.error('Error purchasing item:', error);
        showNotification('❌ Purchase failed');
    }
}

function showNotification(message) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

async function checkAuth() {
    const currentPage = window.location.pathname;
    if (currentPage.includes('auth.html')) return;
    
    try {
        const response = await fetch(`${API_URL}/auth/check`, {
            credentials: 'include'
        });
        const result = await response.json();
        
        if (!result.authenticated) {
            window.location.href = '/pages/auth.html';
        }
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/pages/auth.html';
    }
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.querySelector('.auth-tab:first-child');
    const registerTab = document.querySelector('.auth-tab:last-child');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if (!email || !password) {
        errorEl.textContent = 'Please fill in all fields';
        return;
    }
    
    errorEl.textContent = '';
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('✅ Login successful!');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            errorEl.textContent = result.error || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorEl.textContent = 'Network error. Please try again.';
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const errorEl = document.getElementById('registerError');
    
    if (!name || !email || !password || !confirmPassword) {
        errorEl.textContent = 'Please fill in all fields';
        return;
    }
    
    if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match';
        return;
    }
    
    errorEl.textContent = '';
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ name, email, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('✅ Registration successful!');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            errorEl.textContent = result.error || 'Registration failed';
        }
    } catch (error) {
        console.error('Registration error:', error);
        errorEl.textContent = 'Network error. Please try again.';
    }
}

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                showNotification('✅ Logged out successfully!');
                setTimeout(() => {
                    window.location.href = '/pages/auth.html';
                }, 1000);
            } else {
                window.location.href = '/pages/auth.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/pages/auth.html';
        }
    }
}

async function loadProfile() {
    await loadUser();
    if (!userData) return;
    
    document.getElementById('profileName').value = userData.name || '';
    document.getElementById('profileTitle').value = userData.title || '';
    document.getElementById('profileEmail').value = userData.email || '';
    document.getElementById('profileLevel').textContent = userData.level || 1;
    document.getElementById('profileXP').textContent = userData.xp || 0;
    document.getElementById('profileCoins').textContent = userData.coins || 0;
    document.getElementById('profileGPA').textContent = userData.gpa || '0.0';
    document.getElementById('profileStudyHours').textContent = Math.floor((userData.totalStudyMinutes || 0) / 60);
    document.getElementById('profileStreak').textContent = userData.streak || 0;
    
    const badges = userData.badges || [];
    const badgesGrid = document.getElementById('badgesGrid');
    if (badges.length === 0) {
        badgesGrid.innerHTML = '<p style="color: var(--text-muted);">No badges earned yet. Complete quests to earn badges!</p>';
    } else {
        badgesGrid.innerHTML = badges.map(badge => `
            <div class="badge-item">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
            </div>
        `).join('');
    }
    
    const inventory = userData.inventory || [];
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (inventory.length === 0) {
        inventoryGrid.innerHTML = '<p style="color: var(--text-muted);">Your inventory is empty. Visit the shop to purchase items!</p>';
    } else {
        inventoryGrid.innerHTML = inventory.map(item => `
            <div class="inventory-item">
                <div class="inventory-item-icon">${item.icon}</div>
                <h4>${item.name}</h4>
                <button class="btn btn-secondary" onclick="useItem('${item.id}')">Use</button>
            </div>
        `).join('');
    }
}

async function updateProfile() {
    const name = document.getElementById('profileName').value;
    const title = document.getElementById('profileTitle').value;
    const email = document.getElementById('profileEmail').value;
    
    try {
        const response = await fetch(`${API_URL}/user`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, title, email })
        });
        userData = await response.json();
        updateUserDisplay();
        showNotification('✅ Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('❌ Failed to update profile');
    }
}

function showAvatarPicker() {
    const modalBody = document.getElementById('modalBody');
    const emojis = ['😀', '😎', '🤓', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🎓', '📚', '✏️', '🖊️', '📖', '🎯', '🏆', '⭐', '🌟', '💎', '🔥', '⚡', '🚀', '🎨', '🎭', '🎪', '🎬', '🎮', '🎲', '🧩', '🧠', '💡', '🔬', '🔭', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎼'];
    
    modalBody.innerHTML = `
        <h2>Choose Your Avatar</h2>
        <div class="emoji-picker">
            <div class="emoji-grid">
                ${emojis.map(emoji => `
                    <div class="emoji-option" onclick="selectAvatar('${emoji}')">${emoji}</div>
                `).join('')}
            </div>
        </div>
        <div class="avatar-upload-section">
            <h3>Or Upload Image</h3>
            <input type="file" id="avatarUpload" class="input" accept="image/*">
            <button class="btn btn-primary" onclick="uploadAvatar()">Upload</button>
        </div>
    `;
    document.getElementById('modal').style.display = 'block';
}

async function selectAvatar(emoji) {
    try {
        const response = await fetch(`${API_URL}/user`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: emoji })
        });
        userData = await response.json();
        updateUserDisplay();
        closeModal();
        showNotification('✅ Avatar updated!');
    } catch (error) {
        console.error('Error updating avatar:', error);
        showNotification('❌ Failed to update avatar');
    }
}

async function uploadAvatar() {
    const fileInput = document.getElementById('avatarUpload');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('❌ Please select an image');
        return;
    }
    
    showNotification('Image upload feature coming soon...');
}

function useItem(itemId) {
    showNotification('Item used! Effect applied.');
}

async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const events = await response.json();
        
        if (userData && userData.role === 'admin') {
            document.getElementById('addEventBtn').style.display = 'block';
        }
        
        const container = document.getElementById('eventsList');
        if (events.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No upcoming events.</p>';
            return;
        }
        
        container.innerHTML = events.map(event => {
            const eventDate = new Date(event.date);
            return `
                <div class="event-card">
                    <div class="event-date">${eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-details">
                        <div class="event-detail">📍 ${event.location}</div>
                        <div class="event-detail"><span class="event-type-badge">${event.type}</span></div>
                    </div>
                    ${userData && userData.role === 'admin' ? `
                        <button class="btn btn-danger" style="margin-top: 1rem;" onclick="deleteEvent('${event._id}')">Delete</button>
                    ` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function showAddEventModal() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Add New Event</h2>
        <input type="text" id="newEventTitle" class="input" placeholder="Event Title" required>
        <textarea id="newEventDescription" class="input" placeholder="Description" rows="3"></textarea>
        <input type="date" id="newEventDate" class="input" required>
        <input type="text" id="newEventLocation" class="input" placeholder="Location" required>
        <select id="newEventType" class="input">
            <option value="seminar">Seminar</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
            <option value="social">Social</option>
            <option value="deadline">Deadline</option>
        </select>
        <button class="btn btn-primary" onclick="addEvent()">Create Event</button>
    `;
    document.getElementById('modal').style.display = 'block';
}

async function addEvent() {
    const title = document.getElementById('newEventTitle').value;
    const description = document.getElementById('newEventDescription').value;
    const date = document.getElementById('newEventDate').value;
    const location = document.getElementById('newEventLocation').value;
    const type = document.getElementById('newEventType').value;
    
    if (!title || !date || !location) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, date, location, type })
        });
        closeModal();
        showNotification('✅ Event created!');
        loadEvents();
    } catch (error) {
        console.error('Error adding event:', error);
    }
}

async function deleteEvent(id) {
    const ok = await confirmDialog('Are you sure you want to delete this event?');
    if (!ok) return;
    
    try {
        await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
        showNotification('🗑️ Event deleted');
        loadEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
    }
}

async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        const leaderboard = await response.json();
        
        const container = document.getElementById('leaderboardList');
        if (leaderboard.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No leaderboard data yet.</p>';
            return;
        }
        
        container.innerHTML = leaderboard.slice(0, 10).map((user, index) => `
            <div class="leaderboard-item">
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-avatar">${user.avatar || '🎓'}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-stats">GPA: ${user.gpa || '0.0'} | ${Math.floor((user.totalStudyMinutes || 0) / 60)}h study | ${(user.badges || []).length} badges</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

async function loadUpcomingEventsWidget() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const events = await response.json();
        
        const container = document.getElementById('upcomingEvents');
        const upcomingEvents = events.slice(0, 3);
        
        if (upcomingEvents.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">No upcoming events</p>';
            return;
        }
        
        container.innerHTML = upcomingEvents.map(event => {
            const eventDate = new Date(event.date);
            const daysUntil = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
            
            return `
                <div style="padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid var(--card-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${event.title}</strong>
                            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                                ${event.location}
                            </p>
                        </div>
                        <span style="color: ${daysUntil <= 2 ? 'var(--danger)' : 'var(--accent-purple)'}; font-weight: 600;">
                            ${daysUntil}d
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading upcoming events:', error);
    }
}

function showPurchaseConfirmation(itemId, itemName, cost, icon) {
    if (!userData || userData.coins < cost) {
        showNotification('❌ Not enough coins!');
        return;
    }
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Confirm Purchase</h2>
        <div style="text-align: center; margin: 2rem 0;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${icon}</div>
            <h3>${itemName}</h3>
            <p style="color: var(--text-secondary);">Cost: ${cost} Coins</p>
            <p style="color: var(--accent-purple); font-weight: 600;">Your balance: ${userData.coins} Coins</p>
        </div>
        <div style="display: flex; gap: 1rem;">
            <button class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">Cancel</button>
            <button class="btn btn-primary" onclick="confirmPurchase('${itemId}', '${itemName}', ${cost}, '${icon}')" style="flex: 1;">Purchase</button>
        </div>
    `;
    document.getElementById('modal').style.display = 'block';
}

async function confirmPurchase(itemId, itemName, cost, icon) {
    try {
        const newCoins = userData.coins - cost;
        const response = await fetch(`${API_URL}/user`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coins: newCoins, inventory: [...(userData.inventory || []), { id: itemId, name: itemName, icon }] })
        });
        userData = await response.json();
        updateUserDisplay();
        closeModal();
        showNotification(`🎉 Purchased ${itemName}!`);
        updateShopButtons();
    } catch (error) {
        console.error('Error purchasing item:', error);
        showNotification('❌ Purchase failed');
    }
}

function updateShopButtons() {
    if (!userData) return;
    const buttons = document.querySelectorAll('.shop-buy-btn');
    buttons.forEach(btn => {
        const item = btn.closest('.shop-item');
        const price = parseInt(item.dataset.price);
        if (userData.coins < price) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    });
}

function updateNavAvatar() {
    if (!userData) return;
    const navAvatars = document.querySelectorAll('#navUserAvatar');
    const avatar = userData.avatar || '🎓';
    navAvatars.forEach(el => {
        if (el) el.textContent = avatar;
    });
}

function showAddQuestModal() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Add New Quest</h2>
        <input type="text" id="newQuestTitle" class="input" placeholder="Quest Title" required>
        <textarea id="newQuestDescription" class="input" placeholder="Description" rows="2"></textarea>
        <select id="newQuestType" class="input">
            <option value="daily">Daily Quest</option>
            <option value="weekly">Weekly Quest</option>
        </select>
        <input type="number" id="newQuestTarget" class="input" placeholder="Target (e.g., 5)" required>
        <input type="text" id="newQuestBadgeIcon" class="input" placeholder="Badge Icon (emoji)" required>
        <input type="text" id="newQuestBadgeName" class="input" placeholder="Badge Name" required>
        <button class="btn btn-primary" onclick="addQuest()">Create Quest</button>
    `;
    document.getElementById('modal').style.display = 'block';
}

async function addQuest() {
    const title = document.getElementById('newQuestTitle').value;
    const description = document.getElementById('newQuestDescription').value;
    const type = document.getElementById('newQuestType').value;
    const target = parseInt(document.getElementById('newQuestTarget').value);
    const badgeIcon = document.getElementById('newQuestBadgeIcon').value;
    const badgeName = document.getElementById('newQuestBadgeName').value;
    
    if (!title || !target || !badgeIcon || !badgeName) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        await fetch(`${API_URL}/quests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                description, 
                type, 
                target,
                badge: { icon: badgeIcon, name: badgeName }
            })
        });
        closeModal();
        showNotification('✅ Quest created!');
        loadQuests();
    } catch (error) {
        console.error('Error adding quest:', error);
    }
}
