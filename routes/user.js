const express = require('express');
const controller = require('../controllers/userController');
const router = express.Router();

router.get('/user', controller.getUser);
router.put('/user', controller.updateUser);
router.get('/stats', controller.getStats);
router.get('/activities', controller.getActivities);

module.exports = router;


