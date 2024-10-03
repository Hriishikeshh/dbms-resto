import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'restaurant',
    port: 3306
  });

  try {
    const [rows] = await pool.query('SELECT * FROM tables');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tables' });
  } finally {
    await pool.end();
  }
}

