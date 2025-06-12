import dotenv from "dotenv";
dotenv.config();
import express from "express";
import db, { testConnection } from "./database/db";

const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());

const startServer = async () => {
  try {
    await testConnection(); // ✅ Wait for DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB. Server not started.");
    process.exit(1); // stop the app
  }
};

startServer();
