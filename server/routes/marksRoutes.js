const { authenticate, authorize } = require('../middleware/auth');
const crudRoutes = require('./crudRoutes');
const controller = require('../controllers/marksController');

module.exports = crudRoutes(controller, {
  read: [authenticate, authorize('Admin', 'Teacher', 'Student')],
  write: [authenticate, authorize('Admin', 'Teacher')]
});
