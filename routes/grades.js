const express = require('express');
const controller = require('../controllers/gradesController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/', isAuthenticated, controller.list);
router.post('/', isAuthenticated, controller.create);
router.delete('/:id', isAuthenticated, controller.remove);

module.exports = router;


