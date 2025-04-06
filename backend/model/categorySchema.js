import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
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
      maxlength: [200, "Description cannot exceed 200 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing the slug field for performance
categorySchema.index({ slug: 1 });

// Pre-save middleware to generate slug from name
categorySchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = generateSlug(this.name);
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
