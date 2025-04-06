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

// Indexing for performance
tagSchema.index({ slug: 1 });

// Pre-save middleware to generate slug
tagSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = generateSlug(this.name);
  next();
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
