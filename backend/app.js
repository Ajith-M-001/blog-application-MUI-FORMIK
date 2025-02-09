import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Welcome to BLOG Application - build by Ajith");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is running on the PORT http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("error connecting to database", error.message);
    process.exit(1);
  }
};

startServer();
