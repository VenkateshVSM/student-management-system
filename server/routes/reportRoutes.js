const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { semesterResult, reportPdf, exportExcel } = require('../controllers/reportController');

const router = express.Router();

router.get('/semester/:studentId', authenticate, authorize('Admin', 'Teacher', 'Student'), semesterResult);
router.get('/pdf/:studentId', authenticate, authorize('Admin', 'Teacher', 'Student'), reportPdf);
router.get('/export/:table', authenticate, authorize('Admin'), exportExcel);

module.exports = router;
