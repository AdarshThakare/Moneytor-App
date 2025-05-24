import { sql } from "../config/db.js";

const symmary = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
          SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id= ${userId}
          `;

    const incomeResult = await sql`
           SELECT COALESCE(SUM(amount) , 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0;
           `;

    const expensesResult = await sql`
            SELECT COALESCE(SUM(amount) , 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0;
             `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      incomeResult: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (err) {
    console.log("Error getting the transactios : ", err);
    res.status(500).json("msg : INTERNAL SERVER ERROR from summary");
  }
};

export default symmary;
