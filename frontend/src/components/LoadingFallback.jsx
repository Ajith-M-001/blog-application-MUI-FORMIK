import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

const LoadingFallback = () => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Update progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 100;
        }
        return prevProgress + Math.random() * 15;
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [progress]);

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Letter animation for "NEXUS"
  const letters = "NEXUS".split("");

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Card animation
  const cardVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.19, 1, 0.22, 1],
        delayChildren: 0.3,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: isDarkMode
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  // Progress bar animation
  const progressBarVariants = {
    initial: { width: 0 },
    animate: {
      width: `${Math.min(progress, 100)}%`,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.background.default,
        transition: "background-color 0.3s ease",
      }}
    >
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={cardVariants}
        style={{
          position: "relative",
          width: isMobile ? 300 : 360,
          height: isMobile ? 300 : 360,
          borderRadius: 16,
          // backgroundColor: theme.palette.background.paper,
          // boxShadow: theme.shadows[3],
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Brand Name */}
        <motion.div
          variants={containerVariants}
          style={{
            position: "absolute",
            top: theme.spacing(6),
            display: "flex",
          }}
        >
          {letters.map((letter, index) => (
            <motion.div key={index} variants={letterVariants}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight:
                    index === 0
                      ? 700
                      : index === letters.length - 1
                      ? 700
                      : 400,
                  color:
                    index === 0 || index === letters.length - 1
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  mx: "1px",
                  textShadow: isDarkMode
                    ? "0 0 15px rgba(59, 130, 246, 0.3)"
                    : "none",
                }}
              >
                {letter}
              </Typography>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Circle */}
        <Box sx={{ position: "relative", mt: 4 }}>
          <motion.div
            animate={{
              rotate: 360,
              borderColor: [
                theme.palette.primary.light,
                theme.palette.primary.main,
                theme.palette.primary.dark,
                theme.palette.primary.main,
              ],
            }}
            transition={{
              rotate: {
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              },
              borderColor: {
                repeat: Infinity,
                duration: 4,
              },
            }}
            style={{
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              borderRadius: "50%",
              border: "3px solid",
              borderTopColor: theme.palette.primary.main,
              borderRightColor: "transparent",
              borderBottomColor: theme.palette.primary.main,
              borderLeftColor: "transparent",
            }}
          />
        </Box>

        {/* Progress Bar */}
        <Box
          sx={{
            position: "absolute",
            bottom: theme.spacing(9),
            width: isMobile ? "75%" : "70%",
            height: 4,
            bgcolor: isDarkMode
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <motion.div
            variants={progressBarVariants}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              borderRadius: 8,
            }}
          />
        </Box>

        {/* Loading Text */}
        <Box
          sx={{
            position: "absolute",
            bottom: theme.spacing(4),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={dots}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Loading{dots}
              </motion.span>
            </AnimatePresence>
          </Typography>
        </Box>

        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            opacity: 0.02,
            backgroundImage: `radial-gradient(${
              isDarkMode ? "#ffffff" : "#000000"
            } 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Hover Effect - Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            background: isDarkMode
              ? `radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)`
              : `radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, rgba(0, 0, 0, 0) 70%)`,
            borderRadius: 16,
          }}
        />
      </motion.div>
    </Box>
  );
};

export default LoadingFallback;
