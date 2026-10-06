const createCrudController = require('./crudController');
const teacherModel = require('../models/teacherModel');

module.exports = createCrudController(teacherModel, [
  'teacher_id',
  'name',
  'department',
  'specialization',
  'email',
  'phone',
  'office_location',
  'joining_date',
  'salary',
  'role',
  'assigned_subjects'
]);
