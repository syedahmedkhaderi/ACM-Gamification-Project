const express = require('express');
const controller = require('../controllers/assignmentsController');
const { isAuthenticated } = require('../middleware/auth');
const { applyCache, clearCacheMiddleware } = require('../middleware/cache');
const router = express.Router();

// Apply cache to GET requests (60 seconds)
router.get('/', isAuthenticated, applyCache(60), controller.list);

// Clear cache when data is modified
router.post('/', isAuthenticated, clearCacheMiddleware('/api/assignments*'), controller.create);
router.put('/:id', isAuthenticated, clearCacheMiddleware('/api/assignments*'), controller.update);
router.delete('/:id', isAuthenticated, clearCacheMiddleware('/api/assignments*'), controller.remove);
router.post('/:id/complete', isAuthenticated, clearCacheMiddleware('/api/assignments*'), controller.complete);

module.exports = router;

