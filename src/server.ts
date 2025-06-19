import app from "./app";
import db, { testConnection } from "./database/db";

const PORT = process.env.PORT || 2000;

const startServer = async () => {
  try {
    await testConnection();

    // ✅ Run migrations on server start
    await db.migrate.latest();
    console.log("Migrations completed ✅");

    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(
      "❌ Failed to connect to DB or run migration. Server not started.",
      err
    );
    process.exit(1);
  }
};

startServer();
