import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoute from "./routes/userRoutes";
import transactionRoute from "./routes/transactionRoutes";
import walletRoute from "./routes/walletRoutes";

const app = express();

app.use(express.json());

app.use("/users", userRoute);
app.use("/transaction", transactionRoute);
app.use("/wallet", walletRoute);

app.get("/", (req, res) => {
  res.send("Lendsqr Wallet Service is running 🚀");
});

export default app;
