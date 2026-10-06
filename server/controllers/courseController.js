const createCrudController = require('./crudController');
const courseModel = require('../models/courseModel');

module.exports = createCrudController(courseModel, [
  'course_id',
  'course_name',
  'credits',
  'description',
  'prerequisite'
]);
