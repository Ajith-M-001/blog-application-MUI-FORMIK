// QueryHandler.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Typography,
  Button,
  Skeleton,
  Container,
  Stack,
} from "@mui/material";
import { Refresh, ErrorOutline, HourglassEmpty } from "@mui/icons-material";

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          <AlertTitle>Unexpected Error</AlertTitle>A rendering error occurred in
          this component.
        </Alert>
      );
    }
    return this.props.children;
  }
}

// Default Loading UI
const DefaultLoading = ({ variant = "spinner" }) => {
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
        minHeight={150}
      >
        <HourglassEmpty color="action" />
      </Box>
    );
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={250}
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};

// Default Error UI
const DefaultError = ({ error, onRetry }) => (
  <Alert
    severity="error"
    sx={{ m: 2 }}
    icon={<ErrorOutline />}
    action={
      onRetry && (
        <Button onClick={onRetry} startIcon={<Refresh />} size="small">
          Retry
        </Button>
      )
    }
  >
    <AlertTitle>Error</AlertTitle>
    {error?.message || "An unknown error occurred"}
  </Alert>
);

// Default Empty UI
const DefaultEmpty = () => (
  <Box textAlign="center" py={4}>
    <Typography variant="h6" color="text.secondary">
      No data found
    </Typography>
    <Typography variant="body2" color="text.disabled">
      There's nothing to show here yet.
    </Typography>
  </Box>
);

// Main Component
const QueryHandler = ({
  isLoading,
  isError,
  error,
  isEmpty,
  isRefetching,
  children,

  // Optional UI overrides
  loadingComponent,
  errorComponent,
  emptyComponent,
  skeletonComponent,

  // Behavior
  onRefresh,
  showRetryButton = true,
  fallbackToSkeleton = false,
  retryAttempts = 3,

  // Layout
  fullHeight = false,
  centerContent = false,
  containerProps = {},
}) => {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    if (retryCount < retryAttempts) {
      setRetryCount((prev) => prev + 1);
      onRefresh?.();
    }
  }, [retryCount, retryAttempts, onRefresh]);

  useEffect(() => {
    if (!isError) setRetryCount(0);
  }, [isError]);

  const containerStyle = {
    width: "100%",
    ...(fullHeight && { minHeight: "100vh" }),
    ...(centerContent && {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    ...containerProps.sx,
  };

  const content = useMemo(() => {
    if (isLoading && !isRefetching) {
      return (
        loadingComponent ||
        skeletonComponent || (
          <DefaultLoading
            variant={fallbackToSkeleton ? "skeleton" : "spinner"}
          />
        )
      );
    }

    if (isError) {
      return (
        errorComponent || (
          <DefaultError
            error={error}
            onRetry={
              showRetryButton && retryCount < retryAttempts
                ? handleRetry
                : undefined
            }
          />
        )
      );
    }

    if (isEmpty) {
      return emptyComponent || <DefaultEmpty />;
    }

    if (isRefetching) {
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
              <Typography variant="caption">Refreshing...</Typography>
            </Box>
          </Box>
          <Box sx={{ opacity: 0.6 }}>{children}</Box>
        </Box>
      );
    }

    return children;
  }, [
    isLoading,
    isError,
    isEmpty,
    isRefetching,
    error,
    children,
    loadingComponent,
    errorComponent,
    emptyComponent,
    skeletonComponent,
    fallbackToSkeleton,
    retryCount,
    retryAttempts,
    handleRetry,
    showRetryButton,
  ]);

  return (
    <ErrorBoundary>
      <Box sx={containerStyle} {...containerProps}>
        {content}
      </Box>
    </ErrorBoundary>
  );
};

export default QueryHandler;
