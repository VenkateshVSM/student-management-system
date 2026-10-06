const pool = require('../config/db');
const createCrudModel = require('./crudModel');

const base = createCrudModel('attendance', ['status', 'class_name']);

module.exports = {
  ...base,

  async percentage(studentId) {
    const [rows] = await pool.query(
      `SELECT
        COUNT(*) AS total_classes,
        SUM(CASE WHEN status IN ('Present', 'Late', 'Excused') THEN 1 ELSE 0 END) AS attended_classes
       FROM attendance
       WHERE student_id = ?`,
      [studentId]
    );

    const stats = rows[0] || { total_classes: 0, attended_classes: 0 };
    const total = Number(stats.total_classes || 0);
    const attended = Number(stats.attended_classes || 0);

    return {
      total_classes: total,
      attended_classes: attended,
      percentage: total ? Number(((attended / total) * 100).toFixed(2)) : 0
    };
  }
};
