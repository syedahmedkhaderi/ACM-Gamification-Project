const express = require('express');
const controller = require('../controllers/authController');
const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', controller.getCurrentUser);
router.get('/check', controller.checkAuth);

module.exports = router;
