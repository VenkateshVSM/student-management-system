const createCrudModel = require('./crudModel');

module.exports = createCrudModel('fees', ['receipt_no', 'payment_status']);
