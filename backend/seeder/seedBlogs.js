import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import { faker } from "@faker-js/faker";
import Blog from "../model/blogSchema.js";
import userModel from "../model/user.schema.js";
import Category from "../model/categorySchema.js";
import Tag from "../model/tagSchema.js";
import { BLOG_STATUS } from "../constants/constants.js";
import { generateSlug } from "../utils/generateSlug.js";

dotenv.config({ path: "../.env" });

const generateBlogActivity = () => ({
  total_views: faker.number.int({ min: 100, max: 5000 }),
  total_likes: faker.number.int({ min: 10, max: 1000 }),
  total_comments: faker.number.int({ min: 5, max: 300 }),
  total_shares: faker.number.int({ min: 0, max: 100 }),
  total_bookmarks: faker.number.int({ min: 0, max: 200 }),
  total_replies: faker.number.int({ min: 0, max: 150 }),
});

const imagePool = [
  {
    public_id: "NEXUS_blog_application/06501096-0986-44c8-8928-0d16dc256564",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600640/NEXUS_blog_application/06501096-0986-44c8-8928-0d16dc256564.webp",
  },
  {
    public_id: "NEXUS_blog_application/9f1579be-2719-417b-86a9-3cfa063b215c",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600730/NEXUS_blog_application/9f1579be-2719-417b-86a9-3cfa063b215c.jpg",
  },
  {
    public_id: "NEXUS_blog_application/405dc41e-f23a-48ed-9fe0-f422b6628e8b",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600767/NEXUS_blog_application/405dc41e-f23a-48ed-9fe0-f422b6628e8b.webp",
  },
  {
    public_id: "NEXUS_blog_application/880bbfd3-0fdd-4014-aa1a-d857debed51e",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600810/NEXUS_blog_application/880bbfd3-0fdd-4014-aa1a-d857debed51e.webp",
  },
  {
    public_id: "NEXUS_blog_application/d6543d8c-e8ef-4cca-a6ba-9cb1894d2ba3",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600842/NEXUS_blog_application/d6543d8c-e8ef-4cca-a6ba-9cb1894d2ba3.webp",
  },
  {
    public_id: "NEXUS_blog_application/d49df8b3-3725-490a-a98b-45c2011886bb",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600878/NEXUS_blog_application/d49df8b3-3725-490a-a98b-45c2011886bb.webp",
  },
  {
    public_id: "NEXUS_blog_application/0b696792-d104-4ba6-8e69-6139d9cda742",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600917/NEXUS_blog_application/0b696792-d104-4ba6-8e69-6139d9cda742.webp",
  },
  {
    public_id: "NEXUS_blog_application/10f47048-6a0f-4d94-a0f0-c2fe55c51c0f",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600957/NEXUS_blog_application/10f47048-6a0f-4d94-a0f0-c2fe55c51c0f.webp",
  },
  {
    public_id: "NEXUS_blog_application/a68f8024-874a-4232-9456-3f071fa94ba0",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750600996/NEXUS_blog_application/a68f8024-874a-4232-9456-3f071fa94ba0.webp",
  },
  {
    public_id: "NEXUS_blog_application/57b5d383-d5cb-4f40-8c7a-4a24b3eb01ec",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750601028/NEXUS_blog_application/57b5d383-d5cb-4f40-8c7a-4a24b3eb01ec.webp",
  },
  {
    public_id: "NEXUS_blog_application/695b9838-26d3-48e8-9396-03775858fbfe",
    url: "https://res.cloudinary.com/ajithm/image/upload/v1750601062/NEXUS_blog_application/695b9838-26d3-48e8-9396-03775858fbfe.webp",
  },
];

const NUM_BLOGS = 500;

const generateRandomContent = () => {
  const paragraphs = Array.from(
    { length: faker.number.int({ min: 20, max: 200 }) },
    () => ({
      type: "paragraph",
      content: [{ type: "text", text: faker.lorem.paragraph() }],
    })
  );
  return { type: "doc", content: paragraphs };
};

const generateBlog = async (userId, categories, technologyTagIds) => {
  const title = faker.lorem.sentence({ min: 5, max: 8 });
  const content = generateRandomContent();
  const description = faker.lorem.sentences(2);
  const image = faker.helpers.arrayElement(imagePool);

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
    description,
    slug: finalSlug,
    coverImage: {
      url: image.url,
      public_id: image.public_id,
    },
    status,
    scheduleDateAndTime,
    readingTime,
    author: userId,
    publishedAt: status === BLOG_STATUS.PUBLISHED ? faker.date.recent() : null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    category: faker.helpers.arrayElement(categories),
    tags,
    blogActivity: generateBlogActivity(),
  };
};

const seedBlogs = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    const users = await userModel.find();
    const categories = await Category.find();
    const tags = await Tag.find();

    if (!users.length || !categories.length || !tags.length) {
      console.log("Required users, categories or tags not found");
      process.exit(1);
    }

    console.log(`Generating ${NUM_BLOGS} blogs...`);

    for (let i = 0; i < NUM_BLOGS; i++) {
      const user = faker.helpers.arrayElement(users);
      const category = faker.helpers.arrayElement(categories);
      const tagIds = tags.map((tag) => tag._id);

      const blogData = await generateBlog(user._id, categories, tagIds);
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
        console.log(`Created ${i + 1} blogs`);
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
