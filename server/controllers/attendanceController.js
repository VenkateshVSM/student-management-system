const attendanceModel = require('../models/attendanceModel');
const createCrudController = require('./crudController');

const base = createCrudController(attendanceModel, [
  'student_id',
  'course_id',
  'teacher_id',
  'class_name',
  'attendance_date',
  'status',
  'remarks'
]);

module.exports = {
  ...base,

  async percentage(req, res, next) {
    try {
      const stats = await attendanceModel.percentage(req.params.studentId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
};
