const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const audit = require('../middleware/audit');
const controller = require('../controllers/enrollmentController');

const router = express.Router();

router.get('/', authenticate, authorize('Admin', 'Teacher', 'Student'), controller.list);
router.get('/mine', authenticate, authorize('Student', 'Admin'), controller.myCourses);
router.get('/:id', authenticate, authorize('Admin', 'Teacher', 'Student'), controller.get);
router.post('/', authenticate, authorize('Admin', 'Student'), audit('REGISTER_COURSE'), controller.create);
router.put('/:id', authenticate, authorize('Admin', 'Student'), audit('UPDATE_ENROLLMENT'), controller.update);
router.delete('/:id', authenticate, authorize('Admin', 'Student'), audit('DROP_COURSE'), controller.remove);

module.exports = router;
