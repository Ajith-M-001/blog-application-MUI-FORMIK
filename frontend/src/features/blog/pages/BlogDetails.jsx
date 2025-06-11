import { useParams } from "react-router";
import QueryHandler from "../../../shared/QueryHandler";
import { useGetBlogBySlug } from "../hooks/use-blog";
import { useUserFollowingStatus } from "../../../shared/hooks/use-shared";
import { useUserData } from "../../../shared/store/userStore";
import { isEmpty } from "../../../shared/utils/isEmpty";

const BlogDetails = () => {
  const { slug } = useParams();
  const user = useUserData();

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

  const authorId = blogDetails?.data?.author?._id;

  const {
    data: isFollowingData,
    isLoading: isFollowingLoading,
    isError: isFollowingError,
    error: followingError,
    isFetching: isFollowingFetching,
    refetch: refetchFollowing,
  } = useUserFollowingStatus(
    { userIdToCheck: authorId },
    {
      enabled: !!authorId && user?._id !== authorId,
    }
  );

  console.log(blogDetails, "followingError");

  const handleRefresh = () => {
    if (isBlogError) refetchBlog();
    if (isFollowingError) refetchFollowing();
  };

  console.log(
    "loading000",
    isBlogLoading,
    isFollowingLoading,
    isBlogFetching,
    isFollowingFetching
  );

  const isDataEmpty =
    !isBlogLoading && !isBlogError && isEmpty(blogDetails?.data);

  return (
    <QueryHandler
      isLoading={isBlogLoading || isFollowingLoading}
      isError={isBlogError || isFollowingError}
      error={isBlogError ? blogError : followingError}
      onRefresh={handleRefresh}
      showRetryButton={true}
      retryAttempts={3}
      isRefetching={isBlogFetching || isFollowingFetching}
      isEmpty={isDataEmpty}
    >
      BlogDetails 1234
    </QueryHandler>
  );
};

export default BlogDetails;
