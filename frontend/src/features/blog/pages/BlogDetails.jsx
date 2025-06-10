import { useParams } from "react-router";
import QueryHandler from "../../../shared/QueryHandler";
import { useGetBlogBySlug } from "../hooks/use-blog";

const BlogDetails = () => {
  const { slug } = useParams();

  const {
    data: blogDetails,
    isLoading: isBlogLoading,
    isError: isBlogError,
    error: blogError,
  } = useGetBlogBySlug();

  console.log(blogError, "blogError");

  return (
    <QueryHandler isLoading={isBlogLoading}>BlogDetails 1234</QueryHandler>
  );
};

export default BlogDetails;
