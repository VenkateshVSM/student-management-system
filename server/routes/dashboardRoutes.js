const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  adminDashboard,
  studentDashboard,
  teacherDashboard
} = require('../controllers/dashboardController');

const router = express.Router();

router.get('/admin', authenticate, authorize('Admin'), adminDashboard);
router.get('/student', authenticate, authorize('Student', 'Admin'), studentDashboard);
router.get('/teacher', authenticate, authorize('Teacher', 'Admin'), teacherDashboard);

module.exports = router;
