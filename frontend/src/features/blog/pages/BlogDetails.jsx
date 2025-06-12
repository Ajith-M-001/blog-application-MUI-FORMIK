import { Box } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router";
import QueryHandler from "../../../shared/QueryHandler";
import { useBlogActions } from "../../../shared/store/blogStore";
import { isEmpty } from "../../../shared/utils/isEmpty";
import { BlogContent } from "../components/BlogContent";
import { useGetBlogBySlug } from "../hooks/use-blog";

const BlogDetails = () => {
  const { slug } = useParams();
  const { setBlogData } = useBlogActions();

  const {
    data: blogDetails,
    isLoading: isBlogLoading,
    isError: isBlogError,
    error: blogError,
    isFetching: isBlogFetching,
    refetch: refetchBlog,
  } = useGetBlogBySlug(slug, {
    staleTime: 10000,
    gcTime: 15000,
  });

  useEffect(() => {
    if (blogDetails?.data) {
      setBlogData(blogDetails?.data);
    }
  });

  const handleRefresh = () => {
    if (isBlogError) refetchBlog();
  };

  const isDataEmpty =
    !isBlogLoading && !isBlogError && isEmpty(blogDetails?.data);

  return (
    <QueryHandler
      isLoading={isBlogLoading}
      isError={isBlogError}
      error={blogError}
      onRefresh={handleRefresh}
      showRetryButton={true}
      retryAttempts={3}
      isRefetching={isBlogFetching}
      isEmpty={isDataEmpty}
    >
      <Box width="100%" height={"100%"} maxWidth="md" mx="auto" px={2} py={5}>
        <BlogContent />
      </Box>
    </QueryHandler>
  );
};

export default BlogDetails;
