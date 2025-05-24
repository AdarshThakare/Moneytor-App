import { sql } from "../config/db.js";

const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.status(200).json(transactions);
  } catch (err) {
    console.log("Error getting the transactios : ", err);
    res.status(500).json("msg : INTERNAL SERVER ERROR from getUser");
  }
};

export default getUserTransactions;
