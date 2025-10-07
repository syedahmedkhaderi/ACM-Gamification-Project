const express = require('express');
const controller = require('../controllers/eventsController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', controller.list);
router.post('/', isAdmin, controller.create);
router.put('/:id', isAdmin, controller.update);
router.delete('/:id', isAdmin, controller.remove);

module.exports = router;
