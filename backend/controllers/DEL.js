import { sql } from "../config/db.js";

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    //ensuring db does not crash if id is string
    if (isNaN(parseInt(id))) {
      res.status(400).json({ msg: "Invalid Transaction ID" });
    }

    const result = await sql`
          DELETE FROM transactions WHERE id = ${id} RETURNING * `;

    if (result.length === 0) {
      res.status(404).json({ msg: "Transaction not found" });
    }
    res.status(200).json({ msg: "Transaction deleted successfully" });
  } catch (err) {
    console.log("Error deleting the transactios : ", err);
    res.status(500).json("msg : INTERNAL SERVER ERROR from deleteTrasaction");
  }
};

export default deleteTransaction;
