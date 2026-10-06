const marksModel = require('../models/marksModel');
const createCrudController = require('./crudController');

const gradeFromTotal = (total) => {
  if (total >= 90) return { grade: 'A+', gpa: 4.0 };
  if (total >= 80) return { grade: 'A', gpa: 3.7 };
  if (total >= 70) return { grade: 'B', gpa: 3.0 };
  if (total >= 60) return { grade: 'C', gpa: 2.3 };
  if (total >= 50) return { grade: 'D', gpa: 1.7 };
  return { grade: 'F', gpa: 0 };
};

const withCalculatedResult = (body) => {
  const internal = Number(body.internal_marks || 0);
  const assignment = Number(body.assignment || 0);
  const quiz = Number(body.quiz || 0);
  const project = Number(body.project || 0);
  const finalExam = Number(body.final_exam || 0);
  const total = internal + assignment + quiz + project + finalExam;
  return { ...body, total, ...gradeFromTotal(total) };
};

const base = createCrudController(marksModel, [
  'student_id',
  'course_id',
  'internal_marks',
  'assignment',
  'quiz',
  'project',
  'final_exam',
  'total',
  'grade',
  'gpa'
]);

module.exports = {
  ...base,

  async create(req, res, next) {
    req.body = withCalculatedResult(req.body);
    return base.create(req, res, next);
  },

  async update(req, res, next) {
    req.body = withCalculatedResult(req.body);
    return base.update(req, res, next);
  }
};
