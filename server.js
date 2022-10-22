import dotenv from "dotenv";
import chalk from 'chalk';
import app from "./app.js";
import connectDatabase from "./config/database.js";

// Uncaught Exception Handling
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

const port = process.env.PORT || 4000;

connectDatabase();

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${chalk.greenBright(port)}.`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
