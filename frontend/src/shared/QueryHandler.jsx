
// QueryHandler.jsx

import PropTypes from "prop-types";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Skeleton,
  Stack,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
  HourglassEmpty as HourglassIcon,
} from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";

// --- Default UIs ---

const DefaultError = ({ error, onRetry, showRetryButton }) => (
  <Alert
    severity="error"
    sx={{ m: 2 }}
    icon={<ErrorIcon />}
    action={
      showRetryButton &&
      onRetry && (
        <Button onClick={onRetry} startIcon={<RefreshIcon />} size="small">
          Retry
        </Button>
      )
    }
  >
    <AlertTitle>Error</AlertTitle>
    {error?.response?.data?.message ||
      error?.message ||
      "An unknown error occurred."}
  </Alert>
);

DefaultError.propTypes = {
  error: PropTypes.object,
  onRetry: PropTypes.func,
  showRetryButton: PropTypes.bool.isRequired,
};

const DefaultLoading = ({ variant }) => {
  if (variant === "skeleton") {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="50%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Stack>
      </Container>
    );
  }
  if (variant === "minimal") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={"100%"}
      >
        <HourglassIcon color="action" />
      </Box>
    );
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Loading…
      </Typography>
    </Box>
  );
};

DefaultLoading.propTypes = {
  variant: PropTypes.oneOf(["spinner", "skeleton", "minimal"]),
};

const DefaultEmpty = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    height="100%"
    textAlign="center"
    py={4}
  >
    <Typography variant="h4" color="text.secondary">
      No data found
    </Typography>
    <Typography variant="body1" color="text.disabled">
      There&apos;s nothing to show here yet.
    </Typography>
  </Box>
);

// --- Main Component ---

const QueryHandler = ({
  children,
  isLoading,
  isError,
  error,
  isRefetching,
  isEmpty,
  loadingComponent,
  skeletonComponent,
  errorComponent,
  emptyComponent,

  onRefresh,
  showRetryButton,
  retryAttempts,
  fallbackToSkeleton,

  fullHeight,
  centerContent,
  containerProps,
}) => {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    if (retryCount < retryAttempts) {
      setRetryCount((c) => c + 1);
      onRefresh?.();
    }
  }, [retryCount, retryAttempts, onRefresh]);

  useEffect(() => {
    if (!isError) {
      setRetryCount(0);
    }
  }, [isError]);

  if (!isLoading && isRefetching) {
    return (
      <Box position="relative">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          zIndex={1}
          display="flex"
          justifyContent="center"
          py={1}
        >
          <Box
            display="flex"
            alignItems="center"
            bgcolor="background.paper"
            px={2}
            py={1}
            borderRadius={1}
            boxShadow={1}
            gap={1}
          >
            <CircularProgress size={16} />
            <Typography variant="caption">Refreshing…</Typography>
          </Box>
        </Box>
        <Box sx={{ opacity: 0.6 }}>{children}</Box>
      </Box>
    );
  }

  if (isLoading) {
    return (
      loadingComponent ||
      skeletonComponent || (
        <DefaultLoading variant={fallbackToSkeleton ? "skeleton" : "spinner"} />
      )
    );
  }

  if (isEmpty) {
    return emptyComponent || <DefaultEmpty />;
  }

  if (isError) {
    return (
      errorComponent || (
        <DefaultError
          error={error}
          onRetry={handleRetry}
          showRetryButton={showRetryButton}
        />
      )
    );
  }

  return (
    <Box
      {...containerProps}
      sx={{
        width: "100%",
        ...(fullHeight && { minHeight: "100%" }),
        ...(centerContent && {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }),
        ...containerProps?.sx,
      }}
    >
      {children}
    </Box>
  );
};

QueryHandler.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  error: PropTypes.object,
  isRefetching: PropTypes.bool,
  isEmpty: PropTypes.bool,

  loadingComponent: PropTypes.node,
  skeletonComponent: PropTypes.node,
  errorComponent: PropTypes.node,
  emptyComponent: PropTypes.node,

  onRefresh: PropTypes.func,
  showRetryButton: PropTypes.bool,
  retryAttempts: PropTypes.number,
  fallbackToSkeleton: PropTypes.bool,

  fullHeight: PropTypes.bool,
  centerContent: PropTypes.bool,
  containerProps: PropTypes.object,
};

QueryHandler.defaultProps = {
  isLoading: false,
  isError: false,
  isRefetching: false,
  isEmpty: false,

  showRetryButton: true,
  retryAttempts: 3,
  fallbackToSkeleton: false,

  fullHeight: false,
  centerContent: false,
  containerProps: {},
};

export default QueryHandler;
