const createCrudController = (model, allowedFields) => {
  const pick = (body) =>
    allowedFields.reduce((data, field) => {
      if (Object.prototype.hasOwnProperty.call(body, field)) data[field] = body[field];
      return data;
    }, {});

  return {
    async list(req, res, next) {
      try {
        const rows = await model.list(req.query);
        res.json(rows);
      } catch (error) {
        next(error);
      }
    },

    async get(req, res, next) {
      try {
        const row = await model.findById(req.params.id);
        if (!row) return res.status(404).json({ message: 'Record not found.' });
        return res.json(row);
      } catch (error) {
        return next(error);
      }
    },

    async create(req, res, next) {
      try {
        const row = await model.create(pick(req.body));
        res.status(201).json(row);
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        const row = await model.update(req.params.id, pick(req.body));
        if (!row) return res.status(404).json({ message: 'Record not found.' });
        return res.json(row);
      } catch (error) {
        return next(error);
      }
    },

    async remove(req, res, next) {
      try {
        const removed = await model.remove(req.params.id);
        if (!removed) return res.status(404).json({ message: 'Record not found.' });
        return res.json({ message: 'Record deleted successfully.' });
      } catch (error) {
        return next(error);
      }
    }
  };
};

module.exports = createCrudController;
