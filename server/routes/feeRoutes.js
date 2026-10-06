const { authenticate, authorize } = require('../middleware/auth');
const crudRoutes = require('./crudRoutes');
const controller = require('../controllers/feeController');

module.exports = crudRoutes(controller, {
  read: [authenticate, authorize('Admin', 'Student')],
  write: [authenticate, authorize('Admin')]
});
