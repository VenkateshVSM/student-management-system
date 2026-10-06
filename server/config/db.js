require('dotenv').config();
const { Pool: PgPool } = require('pg');
const mysql = require('mysql2/promise');

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
const isPostgres = Boolean(
  (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) ||
  process.env.DB_CLIENT === 'postgres' ||
  process.env.DB_CLIENT === 'pg' ||
  process.env.DB_CLIENT === 'supabase'
);

let pool;

if (isPostgres) {
  const pgPool = new PgPool({
    connectionString: dbUrl,
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
  });

  // Query adapter providing mysql2-compatible [rows/result, fields] return signature
  pool = {
    async query(sql, params = []) {
      let paramIndex = 1;
      let convertedSql = sql.replace(/\?/g, () => `$${paramIndex++}`);

      // Transform common MySQL-specific functions to PostgreSQL equivalents
      convertedSql = convertedSql.replace(
        /DATE_FORMAT\s*\(\s*([^,]+)\s*,\s*'%Y-%m'\s*\)/gi,
        "TO_CHAR($1, 'YYYY-MM')"
      );
      convertedSql = convertedSql.replace(/\bCURDATE\(\)/gi, 'CURRENT_DATE');

      const isInsert = /^\s*INSERT\s+INTO\b/i.test(convertedSql);
      if (isInsert && !/\bRETURNING\b/i.test(convertedSql)) {
        convertedSql += ' RETURNING id';
      }

      try {
        const res = await pgPool.query(convertedSql, params);

        if (isInsert) {
          const insertId = res.rows[0]?.id;
          return [{ insertId, affectedRows: res.rowCount }, res.fields];
        }

        const isUpdateOrDelete = /^\s*(UPDATE|DELETE)\b/i.test(convertedSql);
        if (isUpdateOrDelete) {
          return [{ affectedRows: res.rowCount, rowCount: res.rowCount }, res.fields];
        }

        return [res.rows, res.fields];
      } catch (err) {
        // Map Postgres unique violation code to MySQL ER_DUP_ENTRY for controller compatibility
        if (err.code === '23505') {
          err.code = 'ER_DUP_ENTRY';
        }
        throw err;
      }
    },
    end: () => pgPool.end(),
    isPostgres: true,
    rawPool: pgPool
  };
} else {
  function buildDbConfig() {
    if (dbUrl) {
      try {
        const { URL } = require('url');
        const parsed = new URL(dbUrl);
        const config = {
          host: parsed.hostname,
          port: parsed.port ? Number(parsed.port) : 3306,
          user: decodeURIComponent(parsed.username),
          password: decodeURIComponent(parsed.password),
          database: parsed.pathname.replace(/^\/+/, '')
        };

        const sslmode = parsed.searchParams.get('sslmode');
        if (sslmode === 'require' || sslmode === 'verify-ca' || sslmode === 'verify-full') {
          config.ssl = { rejectUnauthorized: false };
        }

        return config;
      } catch (error) {
        console.warn('DATABASE_URL parse failed, falling back to DB_* values:', error.message);
      }
    }

    return {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'student_management'
    };
  }

  pool = mysql.createPool(buildDbConfig());
  pool.isPostgres = false;
}

module.exports = pool;
