const createCrudModel = require('./crudModel');

module.exports = createCrudModel('teachers', [
  'teacher_id',
  'name',
  'department',
  'specialization',
  'email',
  'role'
]);
