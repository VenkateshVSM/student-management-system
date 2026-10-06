const createCrudModel = require('./crudModel');

module.exports = createCrudModel('schedules', ['class_name', 'room', 'day', 'teacher_name']);
