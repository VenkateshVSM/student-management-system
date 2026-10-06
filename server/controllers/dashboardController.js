const pool = require('../config/db');

const adminDashboard = async (req, res, next) => {
  try {
    const [[students], [teachers], [courses], [attendance], [fees]] = await Promise.all([
      pool.query('SELECT COUNT(*) AS value FROM students'),
      pool.query('SELECT COUNT(*) AS value FROM teachers'),
      pool.query('SELECT COUNT(*) AS value FROM courses'),
      pool.query('SELECT COUNT(*) AS value FROM attendance'),
      pool.query('SELECT COALESCE(SUM(paid_amount), 0) AS value FROM fees')
    ]);

    const [studentGrowth] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS label, COUNT(*) AS value
       FROM students GROUP BY label ORDER BY label`
    );
    const [attendanceChart] = await pool.query(
      `SELECT status AS label, COUNT(*) AS value FROM attendance GROUP BY status`
    );
    const [feeChart] = await pool.query(
      `SELECT payment_status AS label, COUNT(*) AS value FROM fees GROUP BY payment_status`
    );

    res.json({
      cards: {
        totalStudents: students[0].value,
        totalTeachers: teachers[0].value,
        totalCourses: courses[0].value,
        totalAttendance: attendance[0].value,
        feesCollected: Number(fees[0].value)
      },
      charts: { studentGrowth, attendance: attendanceChart, fees: feeChart }
    });
  } catch (error) {
    next(error);
  }
};

const studentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.student_id || req.query.student_id;
    const [[attendance], [marks], [courses], [fees], [notifications]] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) AS total,
         SUM(CASE WHEN status IN ('Present', 'Late', 'Excused') THEN 1 ELSE 0 END) AS attended
         FROM attendance WHERE student_id = ?`,
        [studentId]
      ),
      pool.query('SELECT * FROM marks WHERE student_id = ? ORDER BY created_at DESC', [studentId]),
      pool.query(
        `SELECT c.* FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.student_id = ?`,
        [studentId]
      ),
      pool.query('SELECT * FROM fees WHERE student_id = ? ORDER BY created_at DESC', [studentId]),
      pool.query(
        "SELECT * FROM notifications WHERE target_role IN ('All', 'Student') ORDER BY created_at DESC LIMIT 10"
      )
    ]);

    const total = Number(attendance[0].total || 0);
    const attended = Number(attendance[0].attended || 0);
    res.json({
      attendance: { total, attended, percentage: total ? Math.round((attended / total) * 100) : 0 },
      marks,
      courses,
      fees,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

const teacherDashboard = async (req, res, next) => {
  try {
    const teacherId = req.user.teacher_id || req.query.teacher_id;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const [[courses], [classes], [attendance], [marks]] = await Promise.all([
      pool.query('SELECT * FROM courses WHERE id IN (SELECT course_id FROM schedules WHERE teacher_id = ?)', [
        teacherId
      ]),
      pool.query('SELECT * FROM schedules WHERE teacher_id = ? AND day = ?', [teacherId, today]),
      pool.query('SELECT * FROM attendance WHERE teacher_id = ? ORDER BY created_at DESC LIMIT 20', [
        teacherId
      ]),
      pool.query(
        `SELECT m.* FROM marks m
         JOIN schedules s ON s.course_id = m.course_id
         WHERE s.teacher_id = ?
         ORDER BY m.created_at DESC LIMIT 20`,
        [teacherId]
      )
    ]);

    res.json({ assignedCourses: courses, todaysClasses: classes, attendance, studentMarks: marks });
  } catch (error) {
    next(error);
  }
};

module.exports = { adminDashboard, studentDashboard, teacherDashboard };
