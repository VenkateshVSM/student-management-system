const pool = require('../config/db');
const createCrudModel = require('./crudModel');

const base = createCrudModel('enrollments', ['status']);

module.exports = {
  ...base,

  async listByStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT e.*, c.course_id, c.course_name, c.credits
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.student_id = ?
       ORDER BY e.created_at DESC`,
      [studentId]
    );
    return rows;
  }
};
