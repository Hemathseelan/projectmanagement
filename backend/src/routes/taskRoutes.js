const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { taskValidator } = require('../validators/taskValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', taskController.list);
router.get('/:id', taskController.getOne);
router.post('/', validate(taskValidator), taskController.create);
router.put('/:id', validate(taskValidator), taskController.update);
router.delete('/:id', taskController.remove);

module.exports = router;
