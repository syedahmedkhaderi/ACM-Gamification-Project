/**
 * Leaderboard functionality
 */

// Initialize the leaderboard
function initLeaderboard() {
  const leaderboardList = document.getElementById('leaderboardList');
  if (!leaderboardList) return;

  // Show loading state
  leaderboardList.innerHTML = `
    <div class="skeleton-item">
      <div class="skeleton title"></div>
      <div class="skeleton text"></div>
    </div>
    <div class="skeleton-item">
      <div class="skeleton title"></div>
      <div class="skeleton text"></div>
    </div>
    <div class="skeleton-item">
      <div class="skeleton title"></div>
      <div class="skeleton text"></div>
    </div>
  `;

  // Fetch leaderboard data
  fetchLeaderboard();
}

// Fetch leaderboard data from API
async function fetchLeaderboard() {
  try {
    const data = await window.appUtils.fetchWithCache('/api/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }, 300000); // Cache for 5 minutes

    renderLeaderboard(data);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    const leaderboardList = document.getElementById('leaderboardList');
    if (leaderboardList) {
      leaderboardList.innerHTML = `<p class="error-text">Failed to load leaderboard. Please try again later.</p>`;
    }
  }
}

// Render leaderboard data
function renderLeaderboard(users) {
  const leaderboardList = document.getElementById('leaderboardList');
  if (!leaderboardList) return;

  // Clear loading state
  leaderboardList.innerHTML = '';

  // If no users, show message
  if (!users || users.length === 0) {
    leaderboardList.innerHTML = `<p class="empty-text">No users found on the leaderboard yet.</p>`;
    return;
  }

  // Create leaderboard items (limited to 5 users)
  const maxUsers = Math.min(users.length, 5);
  
  for (let i = 0; i < maxUsers; i++) {
    const user = users[i];
    const isCurrentUser = user.isCurrentUser;
    
    const leaderboardItem = document.createElement('div');
    leaderboardItem.className = `leaderboard-item ${isCurrentUser ? 'current-user' : ''}`;
    
    leaderboardItem.innerHTML = `
      <div class="leaderboard-rank">${user.rank}</div>
      <div class="leaderboard-avatar">${user.avatar}</div>
      <div class="leaderboard-info">
        <div class="leaderboard-name">${user.name} ${isCurrentUser ? '(You)' : ''}</div>
        <div class="leaderboard-title">${user.title}</div>
      </div>
      <div class="leaderboard-xp">${user.xp} XP</div>
    `;
    
    leaderboardList.appendChild(leaderboardItem);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initLeaderboard();
});

// Export functions
window.leaderboard = {
  init: initLeaderboard,
  refresh: fetchLeaderboard
};