import app from "./app";
import { testConnection } from "./database/db";

const PORT = process.env.PORT || 2000;

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB. Server not started.");
    process.exit(1);
  }
};

startServer();
