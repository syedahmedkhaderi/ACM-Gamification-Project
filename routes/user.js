const express = require('express');
const controller = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/user', isAuthenticated, controller.getUser);
router.put('/user', isAuthenticated, controller.updateUser);
router.get('/stats', isAuthenticated, controller.getStats);
router.get('/activities', isAuthenticated, controller.getActivities);
router.get('/leaderboard', controller.getLeaderboard);
router.get('/inventory', isAuthenticated, controller.getInventory);
router.post('/inventory/:itemId/use', isAuthenticated, controller.useInventoryItem);
router.post('/avatar/upload', isAuthenticated, upload.single('avatar'), controller.uploadAvatar);
router.put('/avatar', isAuthenticated, controller.updateAvatar);

module.exports = router;


