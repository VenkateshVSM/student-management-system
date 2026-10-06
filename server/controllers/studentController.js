const createCrudController = require('./crudController');
const studentModel = require('../models/studentModel');

module.exports = createCrudController(studentModel, [
  'student_id',
  'name',
  'dob',
  'gender',
  'nationality',
  'phone',
  'email',
  'address',
  'parent_details',
  'emergency_contact',
  'previous_school',
  'semester',
  'department',
  'status'
]);
