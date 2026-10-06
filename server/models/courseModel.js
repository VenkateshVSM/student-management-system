const createCrudModel = require('./crudModel');

module.exports = createCrudModel('courses', ['course_id', 'course_name', 'description', 'prerequisite']);
