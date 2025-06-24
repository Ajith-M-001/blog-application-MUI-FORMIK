import PropTypes from "prop-types";
import QueryHandler from "../../../../shared/QueryHandler";
import { useGetRelatedBlogs } from "../../hooks/use-blog";
import { isEmpty } from "../../../../shared/utils/isEmpty";
import { Grid2, Typography } from "@mui/material";
import { RelatedBlogCard } from "./RelatedBlogCard";

const RelatedBlogs = ({ slug }) => {
  const limit = 3;

  const params = {
    limit,
  };
  const {
    data: relatedBlogs,
    isLoading: isBlogLoading,
    isError: isBlogError,
    error: blogError,
    isFetching: isBlogFetching,
    refetch: refetchBlog,
  } = useGetRelatedBlogs(slug, {}, params);

  const isDataEmpty =
    !isBlogLoading && !isBlogError && isEmpty(relatedBlogs?.data);

  const handleRefresh = () => {
    if (isBlogError) refetchBlog();
  };

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
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: 600,
          paddingBottom: 1,
          display: "inline-block",
        }}
      >
        Related Articles
      </Typography>
      <Grid2 container spacing={1}>
        {relatedBlogs?.data?.map((blog) => (
          <Grid2
            size={{
              xs: 12,
              lg: 4,
            }}
            key={blog._id}
          >
            <RelatedBlogCard blog={blog} />
          </Grid2>
        ))}
      </Grid2>
    </QueryHandler>
  );
};

RelatedBlogs.propTypes = {
  slug: PropTypes.string,
};

export { RelatedBlogs };
