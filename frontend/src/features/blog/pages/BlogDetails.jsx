import { Box } from "@mui/material";
import { useParams } from "react-router";
import { useBlogActions } from "../../../shared/store/blogStore";
import { BlogContent } from "../components/BlogContent";
import { useGetBlogBySlug } from "../hooks/use-blog";
import { transformBlogData } from "../utils/transformBlogData";
const BlogDetails = () => {
  const { slug } = useParams();

  const { setBlogData } = useBlogActions();
  const {
    data: blogData,
    isLoading: isBlogLoading,
    isError: isBlogError,
    error: blogError,
  } = useGetBlogBySlug(slug);

  if (blogData) {
    const newBlog = transformBlogData(blogData?.data);

    console.log("newBlog", newBlog);
    setBlogData(newBlog);
  }

  if (isBlogLoading) return <div>Loading...</div>;
  if (isBlogError) return <div>Error: {blogError.message}</div>;

  return (
    <Box width="100%" height={"100%"} maxWidth="lg" mx="auto" px={2} py={5}>
      <BlogContent blogActivity={blogData?.data?.blogActivity} />
    </Box>
  );
};

export default BlogDetails;
