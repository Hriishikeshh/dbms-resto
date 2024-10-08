import connectToDatabase from "../connection";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, ph_number, table_num,allocate_seats, allocate_status } = req.body;

    const pool = connectToDatabase();

    try {
      // Start a transaction
      await pool.query('START TRANSACTION');

      // Insert user into Users table
      const [userResult] = await pool.execute(
        "INSERT INTO Users (ph_number, name, table_num) VALUES (?, ?, ?)",
        [ph_number, name, table_num]
      );

      // Update TableInfo table to allocate the table
      const [tableResult] = await pool.execute(
        "UPDATE TableInfo SET seats = ?, status = ? WHERE table_num = ?",
        [allocate_seats, allocate_status,table_num]
      );

      // Commit the transaction
      await pool.query('COMMIT');

      res.status(201).json({ message: "User added and table allocated successfully", userResult, tableResult });
    } catch (error) {
      // Rollback transaction in case of error
      await pool.query('ROLLBACK');
      console.error("Error adding user or updating table:", error);
      res.status(500).json({ error: "Error adding user and allocating table", details: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
