import dotenv from "dotenv";
import knex from "knex";
import config from "./knexfile";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
const db = knex(config[environment]);

export const testConnection = async () => {
  try {
    await db.raw("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};

export default db;
