const createCrudController = require('./crudController');
const notificationModel = require('../models/notificationModel');

module.exports = createCrudController(notificationModel, [
  'title',
  'message',
  'type',
  'target_role',
  'is_read'
]);
