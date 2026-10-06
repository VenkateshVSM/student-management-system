const express = require('express');
const audit = require('../middleware/audit');

const crudRoutes = (controller, access = {}) => {
  const router = express.Router();
  const canRead = access.read || [];
  const canWrite = access.write || [];

  router.get('/', ...canRead, controller.list);
  router.get('/:id', ...canRead, controller.get);
  router.post('/', ...canWrite, audit('CREATE_RECORD'), controller.create);
  router.put('/:id', ...canWrite, audit('UPDATE_RECORD'), controller.update);
  router.delete('/:id', ...canWrite, audit('DELETE_RECORD'), controller.remove);

  return router;
};

module.exports = crudRoutes;
