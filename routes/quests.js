const express = require('express');
const controller = require('../controllers/questsController');
const router = express.Router();

router.get('/', controller.list);
router.post('/:id/progress', controller.progress);

module.exports = router;


