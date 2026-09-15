const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { projectValidator } = require('../validators/projectValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', projectController.list);
router.get('/:id', projectController.getOne);
router.post('/', validate(projectValidator), projectController.create);
router.put('/:id', validate(projectValidator), projectController.update);
router.delete('/:id', projectController.remove);

module.exports = router;
