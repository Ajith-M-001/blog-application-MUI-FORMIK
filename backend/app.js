import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import countryRoute from "./routes/countriesRoute.js";
import blogRoutes from "./routes/blogRoute.js";
import CategoryRoutes from "./routes/categoryRoutes.js";
import TagRoutes from "./routes/tagRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import User from "./model/user.schema.js";
import cron from "node-cron";
import { configurePassport } from "./config/passport.js";
import ConfigRedisClient from "./config/redis.config.js";
import publishScheduledBlogs from "./publishScheduledBlogs.js";
import socketService from "./services/socket/socketService.js";
dotenv.config();

const app = express();
const httpServer = createServer(app);

//
app.disable("x-powered-by");

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_DEV_URL,
  credentials: true,
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

configurePassport(app);

// Health check
app.get("/", (req, res) => {
  res.send("Welcome to BLOG Application - built by Ajith");
});

// Define API base path in one place
const API_PREFIX = "/api/v1";

// Routes
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/countries`, countryRoute);
app.use(`${API_PREFIX}/blogs`, blogRoutes);
app.use(`${API_PREFIX}/categories`, CategoryRoutes);
app.use(`${API_PREFIX}/tags`, TagRoutes);
app.use(`${API_PREFIX}`, uploadRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    socketService.initialize(httpServer);

    // Check Redis connection before continuing
    if (!ConfigRedisClient.isReady) {
      throw new Error("Redis client is not ready. Exiting...");
    }

    // Cron job to delete inactive users
    cron.schedule("0 6 * * *", async () => {
      try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await User.deleteMany({
          accountStatus: "inactive",
          createdAt: { $lt: twentyFourHoursAgo },
        });
        console.log(`Cleaned up ${result.deletedCount} inactive accounts.`);
      } catch (error) {
        console.error("Error cleaning up inactive accounts:", error);
      }
    });

    // Cron job to publish scheduled blogs every minute
    cron.schedule("* * * * *", async () => {
      console.log("Checking for scheduled blogs to publish...");
      await publishScheduledBlogs();
    });

    // Run immediately on startup to catch overdue scheduled blogs
    await publishScheduledBlogs();

    httpServer.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
