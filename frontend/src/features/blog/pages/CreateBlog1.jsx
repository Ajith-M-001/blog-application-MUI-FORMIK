import { Box } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import BlogHeader from "../components/BlogHeader";
import { Footer } from "../../../shared/components/layout/Footer";
import BlogForm from "../components/BlogForm";

const CreateBlog1 = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        role="document"
        aria-label="Create Blog Page"
      >
        <Box
          data-testid="create-blog-page"
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <header role="banner">
            <BlogHeader />
          </header>
          <Box
            component="main"
            role="main"
            data-testid="blog-form-container"
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: "1100px",
              mx: "auto",
              px: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <BlogForm />
          </Box>
          <footer role="contentinfo">
            <Footer />
          </footer>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBlog1;
