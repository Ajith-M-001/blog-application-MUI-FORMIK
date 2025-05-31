import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import Category from "../model/categorySchema.js";
import { generateSlug } from "../utils/generateSlug.js";

dotenv.config({
  path: "../.env",
});

const categories = [
  {
    name: "Web Development",
    description: "Frontend, backend, and full-stack dev resources and trends.",
  },
  {
    name: "Mobile Development",
    description: "Everything about iOS, Android, and cross-platform apps.",
  },
  {
    name: "Software Engineering",
    description: "Concepts, patterns, and best practices in software dev.",
  },
  {
    name: "DevOps & Infrastructure",
    description: "CI/CD, cloud automation, and system architecture.",
  },
  {
    name: "AI & Machine Learning",
    description: "AI, deep learning, models, datasets, and applications.",
  },
  {
    name: "Cybersecurity",
    description: "Security best practices, breaches, and tips to stay safe.",
  },
  {
    name: "Cloud Computing",
    description: "AWS, GCP, Azure, and cloud-native development.",
  },
  {
    name: "Data Science",
    description: "Data analysis, visualization, and statistical modeling.",
  },
  {
    name: "Big Data",
    description: "Handling massive datasets and real-time processing.",
  },
  {
    name: "Open Source",
    description: "FOSS contributions, projects, and community stories.",
  },
  {
    name: "UI/UX Design",
    description: "Designing delightful, usable, and accessible interfaces.",
  },
  {
    name: "Graphic Design",
    description: "Digital art, branding, and creative workflows.",
  },
  {
    name: "Product Design",
    description: "From idea to execution – product design processes.",
  },
  {
    name: "Design Systems",
    description: "Creating reusable UI components and standards.",
  },
  {
    name: "Startup Stories",
    description: "Journey of founders, pivots, lessons and wins.",
  },
  {
    name: "Product Launches",
    description: "New tools, features, and product updates.",
  },
  {
    name: "Tech News",
    description: "Latest updates and insights from the tech world.",
  },
  {
    name: "Career Advice",
    description: "Interviews, CV tips, growth stories and mentoring.",
  },
  {
    name: "Remote Work",
    description: "Productivity and lifestyle as a remote worker.",
  },
  {
    name: "How-To’s",
    description: "Tutorials, guides, and practical walkthroughs.",
  },
  { name: "Tool Reviews", description: "Tech tools and product comparisons." },
  {
    name: "Community & Events",
    description: "Meetups, conferences, AMAs, and more.",
  },
  {
    name: "Side Projects",
    description: "Hackathons, experiments, and indie dev work.",
  },
  {
    name: "Opinion",
    description: "Editorials, rants, and personal takes on tech.",
  },
  {
    name: "Programming Languages",
    description: "Explore JavaScript, Python, Rust, Go, and more.",
  },
  {
    name: "Testing & QA",
    description: "Automated testing, TDD, and debugging strategies.",
  },
  {
    name: "Game Development",
    description: "Building games using Unity, Unreal, and WebGL.",
  },
  {
    name: "AR/VR",
    description: "Mixed reality development and immersive experiences.",
  },
  {
    name: "Web3 & Blockchain",
    description: "Dapps, smart contracts, and crypto trends.",
  },
  {
    name: "Ethical Tech",
    description: "Sustainable, inclusive, and ethical tech discussions.",
  },
  {
    name: "Content Creation",
    description: "Writing, video, podcasting, and digital media.",
  },
  {
    name: "Technical Writing",
    description: "Docs, dev content, and user education.",
  },
  {
    name: "APIs & Integrations",
    description: "REST, GraphQL, SDKs and third-party services.",
  },
  {
    name: "E-commerce",
    description: "Building and scaling online stores and platforms.",
  },
  {
    name: "Freelancing",
    description: "Client management, pricing, and productivity tips.",
  },
  {
    name: "Digital Marketing",
    description: "SEO, content strategy, and social media tactics.",
  },
  {
    name: "Agile & Scrum",
    description: "Agile methodologies, retrospectives, and planning.",
  },
  {
    name: "Leadership",
    description: "Engineering management, team culture, and mentorship.",
  },
  {
    name: "Education & Learning",
    description: "Courses, learning paths, and study hacks.",
  },
  {
    name: "Tech Culture",
    description: "Trends, memes, and lifestyle in the tech space.",
  },
];

const seedCategories = async () => {
  try {
    await connectDB();
    console.log("Connected to DB.");

    for (const cat of categories) {
      const slugBase = generateSlug(cat.name);
      let slug = slugBase;
      let counter = 1;

      while (await Category.findOne({ slug })) {
        slug = `${slugBase}-${counter++}`;
      }

      const newCategory = new Category({
        name: cat.name,
        slug,
        description: cat.description,
      });

      await newCategory.save();
      console.log(`Added category: ${cat.name}`);
    }

    console.log("All categories added.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding categories:", err);
    process.exit(1);
  }
};

seedCategories();
