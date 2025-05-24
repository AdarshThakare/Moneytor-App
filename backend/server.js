import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import transactionRoute from "./routes/transactionRoute.js";
import rateLimiter from "./middlewares/ratelimiter.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(rateLimiter);

app.use("/api/v1/transactions", transactionRoute);

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Your App is listening at port ${PORT}`);
  });
});
