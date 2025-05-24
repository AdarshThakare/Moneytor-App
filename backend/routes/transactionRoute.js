import express from "express";
import getUserTransactions from "../controllers/GET.js";
import addTransaction from "../controllers/ADD.js";
import summary from "../controllers/PUT.js";
import deleteTransaction from "../controllers/DEL.js";

const router = express.Router();

router.get("/:userId", getUserTransactions);
router.post("/add", addTransaction);
router.get("/summary/:userId", summary);
router.delete("/:id", deleteTransaction);

export default router;
