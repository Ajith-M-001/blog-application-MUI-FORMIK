import { useVirtualizer } from "@tanstack/react-virtual";
import { BLOG_LIMIT } from "../constants/constants";
import { useGetPersonalizedBlogs } from "../hooks/use-blog";
import { useEffect, useRef } from "react";
import { Box, Divider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import BlogPost from "../components/UI/BlogPost";
import { BlogPostSkeleton } from "../components/SkeltonsLoaders/BlogPostSkeleton";

const ForYouBlogs = () => {
  const limit = BLOG_LIMIT;
  const parentRef = useRef(null);

  const {
    data: personalizedBlogs,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError: isPersonalizedBlogsError,
    error: personalizedBlogsError,
  } = useGetPersonalizedBlogs({}, { limit });

  // Fallback to empty array to prevent undefined errors
  const allPersonalizedBlogs =
    personalizedBlogs?.pages?.flatMap((page) => page.data.blogs) || [];

  // Initialize virtualizer before useEffect
  const virtualizer = useVirtualizer({
    count: hasNextPage
      ? allPersonalizedBlogs.length + 1
      : allPersonalizedBlogs.length,
    estimateSize: () => 350, // Adjusted for blog post height
    getScrollElement: () => parentRef.current,
    overscan: 2, // Preload 2 items for smoother scrolling
  });

  // Trigger fetchNextPage when nearing the end of the list
  useEffect(() => {
    const virtualItems = virtualizer.getVirtualItems();
    if (!virtualItems.length) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem?.index >= allPersonalizedBlogs.length - 2 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allPersonalizedBlogs.length,
    isFetchingNextPage,
  ]);

  // Loading state: Show skeleton when initially fetching with no blogs
  if (isFetching && !isFetchingNextPage && allPersonalizedBlogs.length === 0) {
    return <BlogPostSkeleton count={5} />;
  }

  // Error state
  if (isPersonalizedBlogsError) {
    return (
      <Typography color="error" data-testid="error-message">
        Error: {personalizedBlogsError?.message || "Something went wrong"}
      </Typography>
    );
  }

  // Empty state: No blogs found after fetching
  if (allPersonalizedBlogs.length === 0 && !isFetching) {
    return (
      <Typography color="text.secondary" data-testid="no-blogs-message">
        No blogs found
      </Typography>
    );
  }

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Box
      ref={parentRef}
      className="scroll-container"
      sx={{
        height: "90dvh",
        overflow: "auto",
        width: "100%",
      }}
      data-testid="scroll-container"
    >
      <Box
        sx={{
          position: "relative",
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
          }}
        >
          {virtualItems.map(({ index: vIndex, key: vKey }) => {
            const isLoaderRow = vIndex >= allPersonalizedBlogs.length;
            const blog = allPersonalizedBlogs[vIndex];
            return (
              <Box
                key={vKey}
                data-index={vIndex}
                ref={virtualizer.measureElement}
                data-testid={`blog-row-${vIndex}`}
              >
                {isLoaderRow ? (
                  <LoaderRow hasNextPage={hasNextPage} />
                ) : blog ? (
                  <>
                    <BlogPost blog={blog} />
                    <Divider sx={{ my: 2, width: "98%", mx: "auto" }} />
                  </>
                ) : (
                  <EmptyRow />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

const LoaderRow = ({ hasNextPage }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "350px", // Matches estimateSize for consistency
      p: 2,
      mb: 2.5,
      bgcolor: "background.default",
    }}
    data-testid="loader-row"
  >
    <Typography color="text.secondary">
      {hasNextPage ? "Loading more blogs..." : "No more blogs to load"}
    </Typography>
  </Box>
);

LoaderRow.propTypes = {
  hasNextPage: PropTypes.bool,
};

const EmptyRow = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "350px", // Matches estimateSize for consistency
      p: 2,
    }}
    data-testid="empty-row"
  >
    <Typography color="text.secondary">No more blogs to load</Typography>
  </Box>
);

export default ForYouBlogs;
