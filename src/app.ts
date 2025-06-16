import dotenv from "dotenv";
dotenv.config();
import express from "express";
import db, { testConnection } from "./database/db";
import userRoute from "./routes/userRoutes";
import transactionRoute from "./routes/transactionRoutes";
import walletRoute from "./routes/walletRoutes";

const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());

app.use("/users", userRoute);
app.use("/transaction", transactionRoute);
app.use("/wallet", walletRoute);

app.get("/", (req, res) => {
  res.send("Lendsqr Wallet Service is running 🚀");
});

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB. Server not started.");
    process.exit(1);
  }
};

startServer();
