// import mongoose from "mongoose";
// import connectDB from "../config/database.js";
// import { faker } from "@faker-js/faker";
// import { generateSlug } from "../utils/generateSlug.js";
// import Blog from "../model/blogSchema.js";
// import userModel from "../model/user.schema.js";
// import dotenv from "dotenv";
// import { BLOG_STATUS } from "../constants/constants.js";
// dotenv.config({
//   path: "../.env",
// });

// const NUM_BLOGS = 20;

// const CATEGORIES = ["67f86526ae30e34c865f4b66"];

// const technologyTagIds = [
//   "67f8688bd6ddda6cb26dfcb9",
//   "67f86896d6ddda6cb26dfcbe",
//   "67f868a7d6ddda6cb26dfcc3",
//   "67f868b7d6ddda6cb26dfcc8",
//   "67f868ddd6ddda6cb26dfccf",
// ];

// const generateBlog = async (userId) => {
//   const title = faker.lorem.sentence();
//   const content = faker.lorem.paragraphs(10);
//   const description = faker.lorem.sentence();

//   // Generate a unique slug
//   let blogSlugBase = generateSlug(title);
//   let finalSlug = blogSlugBase;
//   let slugExists = await Blog.findOne({ slug: finalSlug });
//   let counter = 1;
//   while (slugExists) {
//     finalSlug = `${blogSlugBase}-${counter}`;
//     slugExists = await Blog.findOne({ slug: finalSlug });
//     counter++;
//   }

//   const statusOptions = [
//     BLOG_STATUS.PUBLISHED,
//     BLOG_STATUS.PUBLISHED,
//     BLOG_STATUS.PUBLISHED,
//     BLOG_STATUS.DRAFT,
//     BLOG_STATUS.SCHEDULED,
//   ];

//   const status = faker.helpers.arrayElement(statusOptions);

//   // Create scheduled date if needed
//   const scheduleDateAndTime =
//     status === BLOG_STATUS.SCHEDULED ? faker.date.future() : null;

//   // Generate reading time with minutes and words structure
//   const readingTime = {
//     minutes: faker.number.int({ min: 2, max: 20 }),
//     words: faker.number.int({ min: 200, max: 5000 }),
//   };

//   const numberOfTags = faker.number.int({
//     min: 1,
//     max: technologyTagIds.length,
//   });
//   const tags = faker.helpers.shuffle(technologyTagIds).slice(0, numberOfTags);

//   return {
//     title,
//     content,
//     category: faker.helpers.arrayElement(CATEGORIES),
//     tags,
//     description,
//     coverImage: {
//       url: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`,
//       publicId: faker.string.uuid(),
//     },
//     status,
//     slug: finalSlug,
//     scheduleDateAndTime,
//     readingTime,
//     author: userId,
//     publishedAt: status === BLOG_STATUS.PUBLISHED ? faker.date.recent() : null,
//     createdAt: faker.date.past(),
//     updatedAt: faker.date.recent(),
//   };
// };

// const seedBlogs = async () => {
//   try {
//     await connectDB();
//     console.log("connected to database");
//     const user = await userModel.findOne();
//     if (!user) {
//       console.log("No user found");
//       process.exit(1);
//     }
//     console.log(`Using user ${user._id} as author for all blogs`);
//     console.log(`Generating ${NUM_BLOGS} blogs...`);
//     for (let i = 0; i < NUM_BLOGS; i++) {
//       const blogData = await generateBlog(user._id);
//       const blog = new Blog(blogData);
//       await blog.save();
//       await userModel.findOneAndUpdate(
//         { _id: user._id },
//         {
//           $inc: { "account_info.total_posts": 1 },
//           $set: { "account_info.last_post_date": new Date() },
//         }
//       );

//       if ((i + 1) % 10 === 0) {
//         console.log(`created ${i + 1} blogs`);
//       }
//     }
//     console.log(`Successfully created ${NUM_BLOGS} blogs`);
//     await mongoose.connection.close();
//     console.log("Database connection closed");

//     process.exit(0);
//   } catch (error) {
//     console.error("Error seeding blogs:", error);
//     process.exit(1);
//   }
// };

// seedBlogs();

import mongoose from "mongoose";
import connectDB from "../config/database.js";
import { faker } from "@faker-js/faker";
import { generateSlug } from "../utils/generateSlug.js";
import Blog from "../model/blogSchema.js";
import userModel from "../model/user.schema.js";
import dotenv from "dotenv";
import { BLOG_STATUS } from "../constants/constants.js";

dotenv.config({ path: "../.env" });

const NUM_BLOGS = 2000;
const CATEGORIES = ["67f86526ae30e34c865f4b66"];
const technologyTagIds = [
  "67f8688bd6ddda6cb26dfcb9",
  "67f86896d6ddda6cb26dfcbe",
  "67f868a7d6ddda6cb26dfcc3",
  "67f868b7d6ddda6cb26dfcc8",
  "67f868ddd6ddda6cb26dfccf",
];

// ✅ Use your actual Cloudinary blog images
const demoImageUrls = [
  "https://res.cloudinary.com/ajithm/image/upload/v1748700167/NEXUS_blog_application/300291ee-cf0f-4355-aa82-7a72092a76d9.webp",
  "https://res.cloudinary.com/ajithm/image/upload/v1748699617/NEXUS_blog_application/c9d5368e-abe7-4c45-955a-22617295c4aa.webp",
  "https://res.cloudinary.com/ajithm/image/upload/v1747790562/NEXUS_blog_application/7fb13b8e-1cbf-4dde-a08c-e2454ca1d5de.jpg",
  "https://res.cloudinary.com/ajithm/image/upload/v1748656727/NEXUS_blog_application/5c3130a9-47f9-4245-a6af-489544c76bc5.webp",
];

const getRandomCloudinaryImage = () =>
  faker.helpers.arrayElement(demoImageUrls);

const generateBlog = async (userId) => {
  const title = faker.lorem.sentence();
  const content = faker.lorem.paragraphs(10);
  const description = faker.lorem.sentence();

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
  const scheduleDateAndTime =
    status === BLOG_STATUS.SCHEDULED ? faker.date.future() : null;

  const readingTime = {
    minutes: faker.number.int({ min: 2, max: 20 }),
    words: faker.number.int({ min: 200, max: 5000 }),
  };

  const numberOfTags = faker.number.int({
    min: 1,
    max: technologyTagIds.length,
  });
  const tags = faker.helpers.shuffle(technologyTagIds).slice(0, numberOfTags);

  return {
    title,
    content,
    category: faker.helpers.arrayElement(CATEGORIES),
    tags,
    description,
    coverImage: {
      url: getRandomCloudinaryImage(),
      publicId: faker.string.uuid(), // optional
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
    console.log("✅ Connected to MongoDB");

    const user = await userModel.findOne();
    if (!user) {
      console.log("❌ No user found");
      process.exit(1);
    }

    console.log(`👤 Using user ${user._id} as author`);
    console.log(`📝 Seeding ${NUM_BLOGS} blogs...`);

    for (let i = 0; i < NUM_BLOGS; i++) {
      const blogData = await generateBlog(user._id);
      const blog = new Blog(blogData);
      await blog.save();

      await userModel.findByIdAndUpdate(user._id, {
        $inc: { "account_info.total_posts": 1 },
        $set: { "account_info.last_post_date": new Date() },
      });

      if ((i + 1) % 5 === 0) {
        console.log(`✅ Created ${i + 1} blogs`);
      }
    }

    console.log("🎉 Seeding complete");
    await mongoose.connection.close();
    console.log("🔌 Disconnected from database");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding blogs:", error);
    process.exit(1);
  }
};

seedBlogs();
