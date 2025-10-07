const express = require('express');
const controller = require('../controllers/studySessionsController');
const router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);

module.exports = router;


