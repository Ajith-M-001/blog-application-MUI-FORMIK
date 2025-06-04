import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import User from "../model/user.schema.js";

dotenv.config({ path: "../.env" });

// Sample user relationships to seed
const relationships = [
  {
    userId: "681f5a20447894eca83aa363", // john
    following: ["67f730b66526a5fca2f4d59f"], // users to follow
  },
  // Add more relationships as needed
];

const seedFollowRelationships = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    for (const relationship of relationships) {
      const user = await User.findById(relationship.userId);

      if (!user) {
        console.log(`User ${relationship.userId} not found. Skipping...`);
        continue;
      }

      // Update following for current user
      await User.findByIdAndUpdate(relationship.userId, {
        $addToSet: { following: { $each: relationship.following } },
      });

      // Update followers for each followed user
      await User.updateMany(
        { _id: { $in: relationship.following } },
        { $addToSet: { followers: relationship.userId } }
      );

      console.log(`✅ Updated relationships for user: ${relationship.userId}`);
    }

    console.log("All follow relationships seeded successfully.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding follow relationships:", err);
    process.exit(1);
  }
};

seedFollowRelationships();
