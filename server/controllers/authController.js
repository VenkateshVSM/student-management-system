const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      student_id: user.student_id,
      teacher_id: user.teacher_id
    },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '8h' }
  );

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'Student', student_id, teacher_id } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, student_id, teacher_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHash, role, student_id || null, teacher_id || null]
    );

    const user = { id: result.insertId, name, email, role, student_id, teacher_id };
    return res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    const passwordMatches =
      user &&
      (user.password_hash.startsWith('$2')
        ? await bcrypt.compare(password || '', user.password_hash)
        : user.password_hash === password);

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is not registered as ${role}.` });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      student_id: user.student_id,
      teacher_id: user.teacher_id
    };

    return res.json({ user: safeUser, token: signToken(safeUser) });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = async (req, res) => {
  res.json({
    message:
      'Password reset request recorded. Connect an email provider to send reset links in production.'
  });
};

module.exports = { register, login, forgotPassword };
