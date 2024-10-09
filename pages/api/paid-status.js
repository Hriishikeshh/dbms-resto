import connectToDatabase from "../connection";

export default async function handler(req, res) {
  const pool = connectToDatabase();

  if (req.method === "POST") {
    const { ph_number,table_num } = req.body; // Get the phone number and table number
    console.log(req.body);
    try {
      
      const[resettableinfo]=await pool.execute(
        "update tableinfo set status='available' where table_num=?",
        [table_num]
      );

      const[users]=await pool.execute(
        "update users set payment_status='paid' where ph_number=? and table_num=?",
        [ph_number,table_num]
      );

      if(resettableinfo && users) console.log("Table and user status resetted");

      res.status(200).json({
        resettableinfo
      });
    } catch (error) {
      console.error("Error reseting", error);
      res.status(500).json({ error: "Error resetting" });
    }
  } 
};