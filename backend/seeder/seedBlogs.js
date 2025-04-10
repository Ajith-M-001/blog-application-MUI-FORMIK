import mongoose from "mongoose";
import connectDB from "../config/database.js";
import { faker } from "@faker-js/faker";
import { generateSlug } from "../utils/generateSlug.js";
import Blog from "../model/blogSchema.js";
import userModel from "../model/user.schema.js";
import dotenv from "dotenv";
import { BLOG_STATUS } from "../../common/constants/constants.js";
dotenv.config({
  path: "../.env",
});

const NUM_BLOGS = 1;

const CATEGORIES = ["67f731a26526a5fca2f4d5a8"];

const generateBlog = async (userId) => {
  const title = faker.lorem.sentence();
  const content = faker.lorem.paragraphs(10);
  const description = faker.lorem.sentence();

  // Generate a unique slug
  let blogSlugBase = generateSlug(title);
  let finalSlug = blogSlugBase;
  let slugExists = await Blog.findOne({ slug: finalSlug });
  let counter = 1;
  while (slugExists) {
    finalSlug = `${blogSlugBase}-${counter}`;
    slugExists = await Blog.findOne({ slug: finalSlug });
    counter++;
  }

  const statusOptions = [
    BLOG_STATUS.PUBLISHED,
    BLOG_STATUS.PUBLISHED,
    BLOG_STATUS.PUBLISHED,
    BLOG_STATUS.DRAFT,
    BLOG_STATUS.SCHEDULED,
  ];

  const status = faker.helpers.arrayElement(statusOptions);

  // Create scheduled date if needed
  const scheduleDateAndTime =
    status === BLOG_STATUS.SCHEDULED ? faker.date.future() : null;

  // Generate reading time with minutes and words structure
  const readingTime = {
    minutes: faker.number.int({ min: 2, max: 20 }),
    words: faker.number.int({ min: 200, max: 5000 }),
  };

  return {
    title,
    content,
    category: faker.helpers.arrayElement(CATEGORIES),
    tags: [],
    description,
    coverImage: {
      url: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`,
      publicId: faker.string.uuid(),
    },
    status,
    slug: finalSlug,
    scheduleDateAndTime,
    readingTime,
    author: userId,
    publishedAt: status === BLOG_STATUS.PUBLISHED ? faker.date.recent() : null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

const seedBlogs = async () => {
  try {
    await connectDB();
    console.log("connected to database");
    const user = await userModel.findOne();
    if (!user) {
      console.log("No user found");
      process.exit(1);
    }
    console.log(`Using user ${user._id} as author for all blogs`);
    console.log(`Generating ${NUM_BLOGS} blogs...`);
    for (let i = 0; i < NUM_BLOGS; i++) {
      const blogData = await generateBlog(user._id);
      const blog = new Blog(blogData);
      await blog.save();
      await userModel.findOneAndUpdate(
        { _id: user._id },
        {
          $inc: { "account_info.total_posts": 1 },
          $set: { "account_info.last_post_date": new Date() },
        }
      );

      if ((i + 1) % 10 === 0) {
        console.log(`created ${i + 1} blogs`);
      }
    }
    console.log(`Successfully created ${NUM_BLOGS} blogs`);
    await mongoose.connection.close();
    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
};

seedBlogs();
