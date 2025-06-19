import dotenv from "dotenv";
dotenv.config();
import express from "express";
import db, { testConnection } from "./database/db";
import userRoute from "./routes/userRoutes";
import transactionRoute from "./routes/transactionRoutes";
import walletRoute from "./routes/walletRoutes";
import { errorMiddleware } from "./middeware/errormiddleware";

const app = express();

app.use(express.json());

app.use("/users", userRoute);
app.use("/transaction", transactionRoute);
app.use("/wallet", walletRoute);

app.get("/", (req, res) => {
  res.send("Lendsqr Wallet Service is running");
});

app.use(errorMiddleware);

export default app;
