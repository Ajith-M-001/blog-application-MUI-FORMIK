import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug.js";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      maxlength: [30, "Tag name cannot exceed 30 characters"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [100, "Description cannot exceed 100 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
