const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const pool = require('../config/db');

const getReportData = async (studentId) => {
  const [[studentRows], [marks]] = await Promise.all([
    pool.query('SELECT * FROM students WHERE id = ?', [studentId]),
    pool.query(
      `SELECT m.*, c.course_name, c.credits
       FROM marks m
       LEFT JOIN courses c ON c.id = m.course_id
       WHERE m.student_id = ?`,
      [studentId]
    )
  ]);

  const totalGpa = marks.reduce((sum, row) => sum + Number(row.gpa || 0), 0);
  const gpa = marks.length ? Number((totalGpa / marks.length).toFixed(2)) : 0;
  return { student: studentRows[0], marks, gpa, cgpa: gpa };
};

const semesterResult = async (req, res, next) => {
  try {
    const data = await getReportData(req.params.studentId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const reportPdf = async (req, res, next) => {
  try {
    const data = await getReportData(req.params.studentId);
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-card-${req.params.studentId}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text('Smart Student Management System', { align: 'center' });
    doc.moveDown().fontSize(14).text('Report Card');
    doc.fontSize(11).text(`Student: ${data.student?.name || 'Unknown'}`);
    doc.text(`Semester: ${data.student?.semester || '-'}`);
    doc.text(`GPA: ${data.gpa}   CGPA: ${data.cgpa}`);
    doc.moveDown();

    data.marks.forEach((mark) => {
      doc.text(
        `${mark.course_name || mark.course_id}: Total ${mark.total}, Grade ${mark.grade}, GPA ${mark.gpa}`
      );
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

const exportExcel = async (req, res, next) => {
  try {
    const allowedTables = [
      'users',
      'students',
      'teachers',
      'departments',
      'courses',
      'enrollments',
      'attendance',
      'marks',
      'fees',
      'schedules',
      'notifications',
      'audit_logs',
      'report_cards'
    ];
    if (!allowedTables.includes(req.params.table)) {
      return res.status(400).json({ message: 'Unsupported export table.' });
    }

    const [rows] = await pool.query(`SELECT * FROM ${req.params.table} LIMIT 1000`);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(req.params.table);
    sheet.columns = Object.keys(rows[0] || { message: 'No records' }).map((key) => ({
      header: key,
      key
    }));
    rows.forEach((row) => sheet.addRow(row));

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.table}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = { semesterResult, reportPdf, exportExcel };
