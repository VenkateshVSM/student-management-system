const pool = require('../config/db');

const audit = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    if (!req.user || res.statusCode >= 400) return;

    try {
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [req.user.id, action, req.ip]
      );
    } catch (error) {
      console.error('Audit log failed:', error.message);
    }
  });

  next();
};

module.exports = audit;
