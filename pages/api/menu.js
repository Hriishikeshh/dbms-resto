import connectToDatabase from "../connection";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const pool = connectToDatabase();

    try {
      const [menuItems] = await pool.execute("SELECT * FROM Menu");
      res.status(200).json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: "Error fetching menu items" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
