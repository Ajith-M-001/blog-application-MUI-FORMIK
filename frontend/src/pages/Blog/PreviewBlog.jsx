import { AnimatePresence, motion } from "motion/react";
import BlogHeader from "./components/BlogHeader";
import { Footer } from "../../components/Footer";
import { Box } from "@mui/material";

const PreviewBlog = () => {
  return (
    <AnimatePresence>
      <motion.div
        key="create-blog"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <BlogHeader />
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: "1100px",
              mx: "auto",
              px: 2,
            }}
          >
            hello
          </Box>
          <Footer />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewBlog;
