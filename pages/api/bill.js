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
    const [rows] = await pool.query('SELECT Users.name, Orders.order_id, Bill.receipt_id, Bill.total_amount FROM Users JOIN Orders ON Users.ph_number = Orders.ph_number JOIN Bill ON Orders.order_id = Bill.order_id WHERE Users.ph_number = "+91-9876543210";');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching menu items' });
  } finally {
    await pool.end();
  }
}
