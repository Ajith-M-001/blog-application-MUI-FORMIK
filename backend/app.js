import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Welcome to BLOG Application - build by Ajith");
});

// Body parser middleware (parsing incoming JSON requests)
app.use(express.json());

// Body parser for URL encoded form data
app.use(express.urlencoded({ extended: true }));

// Mount user routes
app.use("/api/v1/users", userRoutes);

// Handle 404 errors for non-existent routes
app.use(notFound);

// General error handler
app.use(errorHandler);

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
