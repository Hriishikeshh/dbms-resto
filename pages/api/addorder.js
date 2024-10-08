import connectToDatabase from "../connection";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ph_number, item_id, qty, total } = req.body;

    const pool = connectToDatabase();

    try {
      const [result] = await pool.execute(
        "INSERT INTO Orders (ph_number, qty, item_id, total) VALUES (?, ?, ?, ?)",
        [ph_number, qty, item_id, total]
      );
      res.status(201).json({ message: "Order placed successfully", result });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ error: "Error placing order", details: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
