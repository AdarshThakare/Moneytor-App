import { sql } from "../config/db.js";

const addTransaction = async (req, res) => {
  try {
    const { user_id, title, category, amount } = req.body;

    if (!user_id || !title || !category || amount === undefined) {
      return res.status(400).send({ msg: "All the fileds are required" });
    }

    const transaction = await sql`
    INSERT INTO transactions(user_id , title, category, amount)
    VALUES (${user_id}, ${title}, ${category}, ${amount})
    RETURNING * `;

    console.log("Transaction : ", transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ msg: "INTERNAL SERVER ERROR from addUser" });
  }
};

export default addTransaction;
