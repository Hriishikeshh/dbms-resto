// pages/api/order.js

import connectToDatabase from "../connection";

export default async function handler(req, res) {
  const pool = connectToDatabase();

  if (req.method === "GET") {
    try {
      const [orders] = await pool.query("SELECT DISTINCT ph_number, table_num FROM Orders");
      res.status(200).json({
        phoneNumbers: orders.map((order) => order.ph_number),
        tableNumbers: [...new Set(orders.map((order) => order.table_num))],
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Error fetching orders", details: error.message });
    }
  } else if (req.method === "POST") {
    const { ph_number, table_num } = req.body; // Get the phone number and table number

    try {
      // Fetch the total amount from the Orders table
      const [orders] = await pool.execute(
        "SELECT * FROM Orders WHERE ph_number = ? AND table_num = ?",
        [ph_number, table_num]
      );
      
      if (orders.length === 0) {
        return res.status(404).json({ error: "No orders found for the given phone number and table number." });
      }

      const order = orders[0]; // Get the first order since `ph_number` and `table_num` should be unique per order

      // Now, fetch order items using the order_id from the first query
      const [orderItems] = await pool.execute(
        "SELECT oi.item_id, oi.quantity, m.price FROM OrderItems oi JOIN Menu m ON m.item_id = oi.item_id WHERE oi.order_id = ?",
        [order.order_id] // Use the order_id to fetch order items
      );

      const[resettableinfo]=await pool.execute(
        "update tableinfo set status='available' where table_num=?",
        [table_num]
      );

      if(resettableinfo) console.log("Table status resetted");
      console.log("orderItems", orderItems);
      console.log("orders", orders);

      
      res.status(200).json({
        orderItems,
        orders, // Return the total if it exists
      });
    } catch (error) {
      console.error("Error fetching order items:", error);
      res.status(500).json({ error: "Error fetching order items" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
