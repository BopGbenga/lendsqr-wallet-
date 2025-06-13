import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config(); // ✅ fix: actually run the config

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    },
    migrations: {
      directory: "./src/database/migrations",
      extension: "js", // or "ts" if your migrations are in TS
    },
  },
};

export default config;
