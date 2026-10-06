const createCrudModel = require('./crudModel');

module.exports = createCrudModel('notifications', ['title', 'type', 'message', 'target_role']);
