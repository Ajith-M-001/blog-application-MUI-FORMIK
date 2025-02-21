import MongoStore from "connect-mongo";

export const sessionConfig = {
  name: "blog.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // Sessions expire in 1 day
    touchAfter: 24 * 3600, // Update session only every 24 hours unless modified
    autoRemove: "native", // Use MongoDB's native mechanism to remove expired sessions
    crypto: {
      secret: process.env.SESSION_CRYPTO_SECRET,
    },
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: "strict",
    path: "/",
  },
};
