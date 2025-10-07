const isAuthenticated = (req, res, next) => {
  if (!req.session) {
    return res.status(500).json({ error: 'Session not available' });
  }
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

const isAdmin = (req, res, next) => {
  if (!req.session) {
    return res.status(500).json({ error: 'Session not available' });
  }
  if (req.session.userId && req.session.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
};

module.exports = { isAuthenticated, isAdmin };
