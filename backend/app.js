import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import countryRoute from "./routes/countriesRoute.js";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from "cors";
import User from "./model/user.schema.js";
import cron from "node-cron";
import { configurePassport } from "./config/passport.js";

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

// Mount user routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/countries", countryRoute);

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
      } catch (error) {
        console.error("Error cleaning up inactive accounts:", error);
      }
    });
    app.listen(PORT, () => {
      console.log(`server is running on the PORT http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("error connecting to database", error.message);
    process.exit(1);
  }
};

startServer();
