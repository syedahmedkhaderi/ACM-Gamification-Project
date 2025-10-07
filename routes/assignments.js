const express = require('express');
const controller = require('../controllers/assignmentsController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/', isAuthenticated, controller.list);
router.post('/', isAuthenticated, controller.create);
router.put('/:id', isAuthenticated, controller.update);
router.delete('/:id', isAuthenticated, controller.remove);
router.post('/:id/complete', isAuthenticated, controller.complete);

module.exports = router;


