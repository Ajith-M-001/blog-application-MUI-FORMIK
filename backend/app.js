import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import countryRoute from "./routes/countriesRoute.js";
import blogRoutes from "./routes/blogRoute.js";
import CategoryRoutes from "./routes/categoryRoutes.js";
import TagRoutes from "./routes/tagRoutes.js";
import commentRoutes from "./routes/commentRoute.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import User from "./model/user.schema.js";
import cron from "node-cron";
import { configurePassport } from "./config/passport.js";
import ConfigRedisClient from "./config/redis.config.js";
import publishScheduledBlogs from "./publishScheduledBlogs.js";
dotenv.config();

const app = express();

app.disable("x-powered-by");

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Welcome to BLOG Application - build by Ajith");
});

// Body parser middleware (parsing incoming JSON requests)
app.use(express.json());

// Body parser for URL encoded form data
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
// Enable CORS
app.use(cors(corsOptions));

app.use(cookieParser());

configurePassport(app);

const API_PREFIX = "/api/v1";

// Mount user routes
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/countries`, countryRoute);
app.use(`${API_PREFIX}/blogs`, blogRoutes);
app.use(`${API_PREFIX}/categories`, CategoryRoutes);
app.use(`${API_PREFIX}/tags`, TagRoutes);
app.use(`${API_PREFIX}/comments`, commentRoutes);
app.use(`${API_PREFIX}`, uploadRoutes);

// Handle 404 errors for non-existent routes
app.use(notFound);

// General error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    // Start the server
    cron.schedule("0 6 * * *", async () => {
      try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await User.deleteMany({
          accountStatus: "inactive",
          createdAt: { $lt: twentyFourHoursAgo },
        });
        console.log(`Cleaned up ${result.deletedCount} inactive accounts.`);

        if (!ConfigRedisClient.isReady) {
          throw new Error("Redis client is not ready. Exiting...");
        }
      } catch (error) {
        console.error("Error cleaning up inactive accounts:", error);
      }
    });

    // Cron job to publish scheduled blogs (new)
    cron.schedule("* * * * *", async () => {
      console.log("Checking for scheduled blogs to publish...");
      await publishScheduledBlogs();
    });

    // Run immediately on startup to catch any overdue scheduled blogs
    await publishScheduledBlogs();
    app.listen(PORT, () => {
      console.log(`server is running on the PORT http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("error connecting to database", error.message);
    process.exit(1);
  }
};

startServer();
