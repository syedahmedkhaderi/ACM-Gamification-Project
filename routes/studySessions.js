const express = require('express');
const controller = require('../controllers/studySessionsController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/', isAuthenticated, controller.list);
router.post('/', isAuthenticated, controller.create);

module.exports = router;


