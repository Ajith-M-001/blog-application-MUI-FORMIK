import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { authLimiter, limiter } from "./config/auth.config.js";
import useragent from "express-useragent";
import { sessionConfig } from "./config/session.config.js";
import userSessionRoutes from './routes/user.session.route.js'

const app = express();

const PORT = process.env.PORT || 4000;

// Disables the X-Powered-By header to hide the fact that the server is using Express
// app.disable('x-powered-by');

app.use(useragent.express());

app.get("/", (req, res) => {
  res.send("Welcome to BLOG Application - build by Ajith");
});

// Body parser middleware (parsing incoming JSON requests)
app.use(express.json());

// Body parser for URL encoded form data
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(helmet());

app.use(cors());
app.use(session(sessionConfig));

// Mount user routes
const apiRouter = express.Router();
app.use("/api/v1", limiter, apiRouter);
apiRouter.use("/users", userRoutes);
apiRouter.use("/users/session", userSessionRoutes);

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
