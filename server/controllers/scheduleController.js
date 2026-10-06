const createCrudController = require('./crudController');
const scheduleModel = require('../models/scheduleModel');

module.exports = createCrudController(scheduleModel, [
  'class_name',
  'room',
  'day',
  'start_time',
  'end_time',
  'teacher_id',
  'teacher_name',
  'course_id'
]);
