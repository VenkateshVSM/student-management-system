const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const audit = require('../middleware/audit');
const controller = require('../controllers/attendanceController');

const router = express.Router();

router.get('/', authenticate, authorize('Admin', 'Teacher', 'Student'), controller.list);
router.get('/percentage/:studentId', authenticate, authorize('Admin', 'Teacher', 'Student'), controller.percentage);
router.get('/:id', authenticate, authorize('Admin', 'Teacher', 'Student'), controller.get);
router.post('/', authenticate, authorize('Admin', 'Teacher'), audit('MARK_ATTENDANCE'), controller.create);
router.put('/:id', authenticate, authorize('Admin', 'Teacher'), audit('UPDATE_ATTENDANCE'), controller.update);
router.delete('/:id', authenticate, authorize('Admin'), audit('DELETE_ATTENDANCE'), controller.remove);

module.exports = router;
