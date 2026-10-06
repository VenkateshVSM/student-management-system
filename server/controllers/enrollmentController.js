const enrollmentModel = require('../models/enrollmentModel');
const createCrudController = require('./crudController');

const base = createCrudController(enrollmentModel, ['student_id', 'course_id', 'status']);

module.exports = {
  ...base,

  async create(req, res, next) {
    if (req.user.role === 'Student') req.body.student_id = req.user.student_id;
    return base.create(req, res, next);
  },

  async update(req, res, next) {
    if (req.user.role === 'Student') req.body.student_id = req.user.student_id;
    return base.update(req, res, next);
  },

  async myCourses(req, res, next) {
    try {
      const studentId = req.query.student_id || req.user.student_id;
      if (!studentId) return res.status(400).json({ message: 'student_id is required.' });
      const rows = await enrollmentModel.listByStudent(studentId);
      return res.json(rows);
    } catch (error) {
      return next(error);
    }
  }
};
