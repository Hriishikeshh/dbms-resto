import connectToDatabase from "../connection";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, ph_number, table_num, allocate_seats, allocate_status, order_items,total_price } = req.body;
    const pool = connectToDatabase();
    console.log(req.body);

    try {
      // Start a transaction
      await pool.query('START TRANSACTION');

      // Step 1: Insert user into Users table
      const [userResult] = await pool.execute(
        "INSERT INTO Users (ph_number, name, table_num) VALUES (?, ?, ?)",
        [ph_number, name, table_num]
      );

      // Step 2: Update TableInfo table to allocate the table
      const [tableResult] = await pool.execute(
        "UPDATE TableInfo SET seats = ?, status = ? WHERE table_num = ?",
        [allocate_seats, allocate_status, table_num]
      );

      // Step 4: Insert into Orders table
      const [orderResult] = await pool.execute(
        "INSERT INTO Orders (ph_number,table_num,total) VALUES (?,?,?)",
        [ph_number,table_num,total_price]
      );

      // Get the order_id of the newly inserted order
      const orderId = orderResult.insertId;

      // Step 5: Insert each item into the OrderItems table
      for (const item of order_items) {
        const { item_id, quantity } = item;

        await pool.execute(
          "INSERT INTO OrderItems (order_id, item_id, quantity) VALUES (?, ?, ?)",
          [orderId, item_id, quantity]
        );
      }

      // Commit the transaction
      await pool.query('COMMIT');

      res.status(201).json({
        message: "User added, table allocated, and order created successfully",
        userResult,
        tableResult,
        orderId,
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
