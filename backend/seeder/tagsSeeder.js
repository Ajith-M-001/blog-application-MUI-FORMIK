import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import Tag from "../model/tagSchema.js";
import { generateSlug } from "../utils/generateSlug.js";

dotenv.config({ path: "../.env" });

const tags = [
  // 💻 Programming Languages & Frameworks
  { name: "JavaScript", description: "The language of the web." },
  { name: "TypeScript", description: "Typed JavaScript at scale." },
  { name: "React", description: "A JavaScript library for building UIs." },
  { name: "Vue", description: "The progressive JavaScript framework." },
  { name: "Node.js", description: "Server-side JavaScript runtime." },
  { name: "Python", description: "Versatile language for web, AI, and more." },
  { name: "Django", description: "A high-level Python web framework." },
  { name: "Next.js", description: "React framework for production." },

  // 🌐 Web & App Dev
  { name: "Frontend", description: "Client-side development techniques." },
  { name: "Backend", description: "Server-side development insights." },
  { name: "Full-Stack", description: "Everything from UI to database." },
  { name: "HTML", description: "Markup for creating web pages." },
  { name: "CSS", description: "Styling for beautiful layouts." },
  { name: "Tailwind CSS", description: "Utility-first CSS framework." },
  { name: "SASS", description: "A CSS preprocessor." },

  // ☁️ Cloud & DevOps
  { name: "AWS", description: "Amazon Web Services – cloud computing." },
  { name: "Docker", description: "Containerized app deployment." },
  { name: "Kubernetes", description: "Container orchestration system." },
  { name: "CI/CD", description: "Continuous Integration and Delivery." },

  // 🤖 AI & Data
  { name: "AI", description: "Artificial intelligence developments." },
  { name: "Machine Learning", description: "Building predictive models." },
  { name: "Data Visualization", description: "Making data beautiful." },
  { name: "Prompt Engineering", description: "Optimizing LLM inputs." },

  // 🛡️ Security & Performance
  { name: "Authentication", description: "User login and access control." },
  { name: "Authorization", description: "Roles, permissions, and access." },
  { name: "Performance", description: "Optimizing speed and efficiency." },
  { name: "SEO", description: "Search engine optimization strategies." },

  // 🧠 Concepts & Practices
  { name: "Clean Code", description: "Writing maintainable code." },
  {
    name: "Design Patterns",
    description: "Reusable software design strategies.",
  },
  { name: "Testing", description: "Unit, integration, and E2E testing." },
  { name: "Agile", description: "Agile methodology and sprints." },

  // 🎨 Design & Creativity
  { name: "UI", description: "User Interface design tips." },
  { name: "UX", description: "User Experience best practices." },
  { name: "Figma", description: "Collaborative UI design tool." },
  { name: "Illustrations", description: "Adding visual storytelling." },

  // 🧳 Freelance, Career & Lifestyle
  { name: "Freelancing", description: "Running your own dev biz." },
  { name: "Remote Work", description: "Working from anywhere." },
  { name: "Interviews", description: "Preparation and insights." },
  { name: "Productivity", description: "Hacks to work smarter." },
];

const seedTags = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    for (const tag of tags) {
      const existing = await Tag.findOne({
        name: { $regex: new RegExp(`^${tag.name}$`, "i") },
      });

      if (existing) {
        console.log(`Tag "${tag.name}" already exists. Skipping...`);
        continue;
      }

      let baseSlug = generateSlug(tag.name);
      let finalSlug = baseSlug;
      let slugExists = await Tag.findOne({ slug: finalSlug });
      let counter = 1;
      while (slugExists) {
        finalSlug = `${baseSlug}-${counter}`;
        slugExists = await Tag.findOne({ slug: finalSlug });
        counter++;
      }

      const newTag = new Tag({
        ...tag,
        slug: finalSlug,
      });

      await newTag.save();
      console.log(`✅ Created tag: ${tag.name}`);
    }

    console.log("All tags seeded successfully.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding tags:", err);
    process.exit(1);
  }
};

seedTags();
