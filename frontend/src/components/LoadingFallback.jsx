// import { Box, CircularProgress, Typography } from "@mui/material";

// const LoadingFallback = () => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         gap: 2,
//       }}
//     >
//       <CircularProgress size={40} />
//       <Typography variant="body1" color="text.secondary">
//         Loading...
//       </Typography>
//     </Box>
//   );
// };

// export { LoadingFallback };

import { Box, Skeleton, Container, useTheme } from "@mui/material";
import { keyframes } from "@mui/system";

const LoadingFallback = () => {
  const theme = useTheme();

  // Create shimmering animation keyframes
  const shimmer = keyframes`
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  `;

  // Custom skeleton component with shimmer effect
  const ShimmerSkeleton = ({
    variant = "rectangular",
    width,
    height,
    sx = {},
  }) => (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      sx={{
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, 
            transparent, 
            ${
              theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(255, 255, 255, 0.1)"
            }, 
            transparent)`,
          animation: `${shimmer} 2s infinite`,
          transform: "translateX(-100%)",
        },
        ...sx,
      }}
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        pt: `${theme.mixins.toolbar.minHeight + 16}px`,
        pb: theme.spacing(1),
      }}
    >
      {/* Header Skeleton */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: theme.mixins.toolbar.minHeight,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          px: 3,
          zIndex: 1100,
        }}
      >
        <ShimmerSkeleton
          variant="rectangular"
          width={100}
          height={32}
          sx={{ borderRadius: 1 }}
        />
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 2,
            mx: 3,
          }}
        >
          {[1, 2, 3].map((item) => (
            <ShimmerSkeleton key={item} variant="text" width={80} height={32} />
          ))}
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <ShimmerSkeleton
            variant="rectangular"
            width={140}
            height={32}
            sx={{ borderRadius: 50 }}
          />
          <ShimmerSkeleton variant="circular" width={32} height={32} />
          <ShimmerSkeleton
            variant="rectangular"
            width={80}
            height={32}
            sx={{ borderRadius: 50 }}
          />
          <ShimmerSkeleton
            variant="rectangular"
            width={80}
            height={32}
            sx={{ borderRadius: 50 }}
          />
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
          <ShimmerSkeleton
            variant="circular"
            width={32}
            height={32}
            sx={{ mr: 1 }}
          />
          <ShimmerSkeleton variant="circular" width={32} height={32} />
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl">
        {/* Page Title */}
        <ShimmerSkeleton
          variant="rectangular"
          width={300}
          height={50}
          sx={{ mb: 4, mt: 2, borderRadius: 1 }}
        />

        {/* Content Blocks - adjust based on typical page structure */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 4,
          }}
        >
          <ShimmerSkeleton
            variant="rectangular"
            width="100%"
            height={250}
            sx={{ borderRadius: 2, flexGrow: 2 }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: { xs: "100%", md: "30%" },
            }}
          >
            <ShimmerSkeleton
              variant="rectangular"
              width="100%"
              height={70}
              sx={{ borderRadius: 1 }}
            />
            <ShimmerSkeleton
              variant="rectangular"
              width="100%"
              height={70}
              sx={{ borderRadius: 1 }}
            />
            <ShimmerSkeleton
              variant="rectangular"
              width="100%"
              height={70}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </Box>

        {/* Additional Content Sections */}
        <Box sx={{ mb: 4 }}>
          <ShimmerSkeleton
            variant="text"
            width={200}
            height={40}
            sx={{ mb: 2 }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ShimmerSkeleton
                key={item}
                variant="rectangular"
                width="100%"
                height={200}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>
        </Box>
      </Container>

      {/* Footer Skeleton */}
      <Box
        sx={{
          height: "60px",
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <ShimmerSkeleton variant="text" width={200} height={20} />
      </Box>
    </Box>
  );
};

export { LoadingFallback };
