// scripts/addFcmTokenField.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "../model/user.schema.js";
import connectDB from "../config/database.js";

dotenv.config({
  path: "../.env",
});
async function runMigration() {
  await connectDB();
  console.log("Connected to database");

  const res = await userModel.updateMany(
    { fcmToken: { $exists: false } },
    { $set: { fcmToken: [] } }
  );

  console.log(`Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});
