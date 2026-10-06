const feeModel = require('../models/feeModel');
const createCrudController = require('./crudController');

const base = createCrudController(feeModel, [
  'student_id',
  'tuition_fee',
  'hostel_fee',
  'bus_fee',
  'scholarship',
  'paid_amount',
  'pending_amount',
  'payment_status',
  'receipt_no'
]);

const withPendingAmount = (body) => {
  const total =
    Number(body.tuition_fee || 0) +
    Number(body.hostel_fee || 0) +
    Number(body.bus_fee || 0) -
    Number(body.scholarship || 0);
  const paid = Number(body.paid_amount || 0);
  return {
    ...body,
    pending_amount: Math.max(total - paid, 0),
    payment_status: total - paid <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending'
  };
};

module.exports = {
  ...base,

  async create(req, res, next) {
    req.body = {
      receipt_no: req.body.receipt_no || `R-${Date.now()}`,
      ...withPendingAmount(req.body)
    };
    return base.create(req, res, next);
  },

  async update(req, res, next) {
    req.body = withPendingAmount(req.body);
    return base.update(req, res, next);
  }
};
