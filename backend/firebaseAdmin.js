// utils/firebaseAdmin.js
import admin from "firebase-admin";
import path from "path";
import { readFileSync } from "fs";

// 📌 Use import.meta.dirname (Node.js ≥20.11) to get current file directory
const __dirname = import.meta.dirname;

// Load the service account JSON
const serviceAccountPath = path.join(
  __dirname,
  "config",
  "firebase-adminsdk.json"
);

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

export { admin, messaging };
