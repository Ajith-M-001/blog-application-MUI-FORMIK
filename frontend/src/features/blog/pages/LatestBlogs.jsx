import { useEffect, useRef } from "react";
import { useInfiniteGetAllBlogs } from "../hooks/use-blog";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Divider, Typography } from "@mui/material";
import PropTypes from "prop-types";
import BlogPost from "../components/UI/BlogPost";
import { BLOG_LIMIT } from "../constants/constants";
import { BlogPostSkeleton } from "../components/SkeltonsLoaders/BlogPostSkeleton";

const LatestBlogs = () => {
  const limit = BLOG_LIMIT;
  const parentRef = useRef(null);

  const {
    data: infiniteBlogs,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError: isInfiniteBlogsError,
    error: infiniteBlogsError,
  } = useInfiniteGetAllBlogs({}, { limit });

  const allBlogs =
    infiniteBlogs?.pages.flatMap((page) => page.data.blogs) || [];

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allBlogs.length + 1 : allBlogs.length,
    estimateSize: () => 350, // Adjusted for better accuracy
    getScrollElement: () => parentRef.current,
  });

  useEffect(() => {
    const virtualItems = virtualizer.getVirtualItems();
    if (!virtualItems.length) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem?.index >= allBlogs.length - 2 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allBlogs.length,
    isFetchingNextPage,
    virtualizer.getVirtualItems(),
  ]);

  if (isFetching && !isFetchingNextPage && allBlogs.length === 0) {
    return <BlogPostSkeleton count={5} />;
  }

  if (isInfiniteBlogsError) {
    return (
      <Typography color="error">
        Error: {infiniteBlogsError?.message || "Something went wrong"}
      </Typography>
    );
  }

  if (allBlogs.length === 0 && !isFetching) {
    return <Typography color="text.secondary">No blogs found</Typography>;
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
            const isLoaderRow = vIndex >= allBlogs.length;
            const blog = allBlogs[vIndex];
            return (
              <Box
                key={vKey}
                data-index={vIndex}
                ref={virtualizer.measureElement}
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
      height: "100px",
      p: 2,
      mb: 2.5,
      bgcolor: "background.default",
    }}
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
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
    }}
  >
    <Typography color="text.secondary">No more blogs to load</Typography>
  </Box>
);

export default LatestBlogs;
