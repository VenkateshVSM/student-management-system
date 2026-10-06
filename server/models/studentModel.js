const createCrudModel = require('./crudModel');

module.exports = createCrudModel('students', [
  'student_id',
  'name',
  'email',
  'phone',
  'department',
  'semester',
  'status'
]);
