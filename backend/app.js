import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import userSessionRoutes from "./routes/user.session.router.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { authLimiter, limiter } from "./config/auth.config.js";
import useragent from "express-useragent";

const app = express();

app.use(useragent.express());

const PORT = process.env.PORT || 4000;

// Disables the X-Powered-By header to hide the fact that the server is using Express
// app.disable('x-powered-by');

app.get("/", (req, res) => {
  res.send("Welcome to BLOG Application - build by Ajith");
});

// Session configuration
app.use(
  session({
    name: "blog.sid",
    secret: process.env.SESSION_SECRET, // Secure this secret in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      httpOnly: true, // Mitigates XSS attacks by making the cookie inaccessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only set in HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax", // Prevents CSRF attacks
    },
  })
);

// Body parser middleware (parsing incoming JSON requests)
app.use(express.json());

// Body parser for URL encoded form data
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(helmet());

app.use(cors());

// Mount user routes
const apiRouter = express.Router();
app.use("/api/v1", limiter, apiRouter);
apiRouter.use("/users", authLimiter, userRoutes);
apiRouter.use("/users/session", authLimiter, userSessionRoutes);

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
