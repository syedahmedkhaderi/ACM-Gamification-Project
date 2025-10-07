const express = require('express');
const controller = require('../controllers/examsController');
const router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/complete', controller.complete);

module.exports = router;


