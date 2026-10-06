const { authenticate, authorize } = require('../middleware/auth');
const crudRoutes = require('./crudRoutes');
const controller = require('../controllers/teacherController');

module.exports = crudRoutes(controller, {
  read: [authenticate, authorize('Admin', 'Teacher')],
  write: [authenticate, authorize('Admin')]
});
