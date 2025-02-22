import MongoStore from "connect-mongo";

export const COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "_sid" : "sid";

// Create a robust MongoDB session store
export const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI, // Use a secure, private connection string from environment variables
  ttl: 24 * 60 * 60, // Sessions expire after 24 hours (in seconds)
  autoRemove: "native", // Leverage MongoDB's native mechanism for removing expired sessions
  crypto: {
    secret: process.env.SESSION_CRYPTO_SECRET, // Encrypt session data using a strong, environment-defined secret
  },
  collectionName: "sessions", // Specify a custom collection for clarity and management
});

// Best practice session configuration for Express
export const sessionConfig = {
  name: COOKIE_NAME, // Use a generic name in production to hide tech details
  secret: process.env.SESSION_SECRET, // Use a strong secret from an environment variable
  resave: false, // Avoid re-saving unmodified sessions
  saveUninitialized: false, // Do not save sessions that are uninitialized
  store: sessionStore, // Use the enhanced MongoDB session store
  rolling: true, // Refresh session expiration on each request (if activity continues)
  cookie: {
    httpOnly: true, // Prevent client-side JavaScript access (mitigates XSS risks)
    secure: process.env.NODE_ENV === "production", // Send cookies only over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Adjust sameSite to protect against CSRF
    maxAge:
      process.env.NODE_ENV === "production"
        ? 60 * 60 * 1000 // 1 hour in production for tighter security
        : 2 * 60 * 1000, // 2 minutes in development for convenience
    path: "/", // Make the cookie available across the entire domain
  },
};
