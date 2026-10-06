const pool = require('../config/db');

const buildInsert = (data) => {
  const keys = Object.keys(data);
  return {
    columns: keys.join(', '),
    placeholders: keys.map(() => '?').join(', '),
    values: keys.map((key) => data[key])
  };
};

const buildUpdate = (data) => {
  const keys = Object.keys(data);
  return {
    assignments: keys.map((key) => `${key} = ?`).join(', '),
    values: keys.map((key) => data[key])
  };
};

const createCrudModel = (table, searchableColumns = []) => ({
  async list({ search, limit = 100, offset = 0 } = {}) {
    const values = [];
    let sql = `SELECT * FROM ${table}`;

    if (search && searchableColumns.length) {
      const like = `%${search}%`;
      sql += ` WHERE ${searchableColumns.map((column) => `${column} LIKE ?`).join(' OR ')}`;
      values.push(...searchableColumns.map(() => like));
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, values);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return rows[0];
  },

  async create(data) {
    const insert = buildInsert(data);
    const [result] = await pool.query(
      `INSERT INTO ${table} (${insert.columns}) VALUES (${insert.placeholders})`,
      insert.values
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const update = buildUpdate(data);
    if (!update.assignments) return this.findById(id);

    await pool.query(`UPDATE ${table} SET ${update.assignments} WHERE id = ?`, [
      ...update.values,
      id
    ]);
    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
});

module.exports = createCrudModel;
