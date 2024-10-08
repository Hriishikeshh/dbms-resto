import connectToDatabase from "../connection";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, ph_number, table_num, allocate_seats, allocate_status,order_items } = req.body;
    // console.log("request :", req.body);
    console.log(req.body);
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
        [allocate_seats, allocate_status, table_num]
      );

      // Create user order
      for (const item of order_items) {
        const { item_id, quantity } = item;
        const total = item.price * quantity;

        await pool.execute(
          "INSERT INTO Orders (ph_number, qty, item_id, total) VALUES (?, ?, ?, ?)",
          [ph_number, quantity, item_id, total]
        );
      }

      // Commit the transaction
      await pool.query('COMMIT');

      res.status(201).json({
        message: "User added, table allocated, and order created successfully",
        userResult,
        tableResult,
        // userOrderResult
      });
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
