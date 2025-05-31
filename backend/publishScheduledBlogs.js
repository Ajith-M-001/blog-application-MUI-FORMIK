// publishScheduledBlogs.js
import { BLOG_STATUS } from "./constants/constants.js";
import Blog from "./model/blogSchema.js";
import { redisService } from "./services/redis/cacheService.js";

const publishScheduledBlogs = async () => {
  try {
    const currentTime = new Date();

    // Find blogs with status "scheduled" and scheduleDateAndTime <= current time
    const blogsToPublish = await Blog.find({
      status: "scheduled",
      scheduleDateAndTime: { $lte: currentTime },
    });

    if (blogsToPublish.length === 0) {
      console.log("No blogs to publish at this time.");
    }

    for (const blog of blogsToPublish) {
      blog.status = BLOG_STATUS.PUBLISHED;
      blog.scheduleDateAndTime = null;
      await blog.save();

      await redisService.clearCacheByPattern("blogs:*");
    }
    console.log(
      "Number of blogs to publish:",
      currentTime,
      blogsToPublish.length
    );
  } catch (error) {
    console.error("Error publishing scheduled blogs:", error);
  }
};

export default publishScheduledBlogs;
